const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const root = path.join(__dirname, "..");

function adapter(client, fetchImpl) {
  const context = { URL, console, AbortSignal, fetch: fetchImpl, window: {
    APP_CONFIG: { authProvider: "supabase", supabaseUrl: "https://test.supabase.co", supabaseAnonKey: "public-key" },
    location: { href: "https://learningpython.vercel.app/learn.html" },
    supabase: { createClient: (url, key, options) => {
      assert.equal(options.auth.flowType, "pkce");
      assert.equal(options.auth.detectSessionInUrl, true);
      return client;
    } }
  } };
  vm.runInNewContext(fs.readFileSync(path.join(root, "auth.js"), "utf8"), context);
  return context.window.APP_AUTH;
}
test("OAuth uses PKCE client and returns both providers to the landing page", async () => {
  const calls = [];
  const auth = adapter({ auth: {
    signInWithOAuth: async values => {
      calls.push(values);
      return { data: { url: "https://test.supabase.co/auth/v1/authorize?provider=" + values.provider }, error: null };
    }
  } }, async (url, options) => {
    assert.equal(String(url), "https://test.supabase.co/auth/v1/settings");
    assert.equal(options.headers.apikey, "public-key");
    assert.equal(options.cache, "no-store");
    return { ok: true, json: async () => ({ external: { google: true, discord: true } }) };
  });
  for (const provider of ["google", "discord"]) {
    const result = await auth.signInWithProvider(provider);
    assert.equal(result.error, null);
    assert.equal(calls.at(-1).provider, provider);
    assert.equal(calls.at(-1).options.redirectTo, "https://learningpython.vercel.app/?auth=oauth");
    assert.equal(calls.at(-1).options.skipBrowserRedirect, true);
  }
});
test("OAuth blocks disabled and unknown providers, and retries after a provider is enabled", async () => {
  let enabled = false, requested = 0, started = 0;
  const auth = adapter({ auth: {
    signInWithOAuth: async () => {
      started++;
      return { data: { url: "https://test.supabase.co/auth/v1/authorize" }, error: null };
    }
  } }, async () => {
    requested++;
    return { ok: true, json: async () => ({ external: { google: enabled } }) };
  });
  await assert.rejects(auth.signInWithProvider("github"), /Неизвестный/);
  await assert.rejects(auth.signInWithProvider("__proto__"), /Неизвестный/);
  assert.equal(requested, 0);
  await assert.rejects(auth.signInWithProvider("google"), /пока не подключён/);
  assert.equal(started, 0);
  enabled = true;
  await auth.signInWithProvider("google");
  assert.equal(started, 1);
  assert.equal(requested, 2);
});
test("OAuth fails safely on settings errors and unsafe redirect URLs", async () => {
  let started = false;
  const client = { auth: { signInWithOAuth: async () => {
    started = true;
    return { data: { url: "https://example.test/phishing" }, error: null };
  } } };
  await assert.rejects(adapter(client, async () => ({ ok: false })).signInWithProvider("google"), /проверить доступность/);
  assert.equal(started, false);
  await assert.rejects(adapter(client, async () => { throw new Error("network unavailable"); }).signInWithProvider("discord"), /network/);
  assert.equal(started, false);
  await assert.rejects(adapter(client, async () => ({ ok: true, json: async () => ({ external: { google: true } }) })).signInWithProvider("google"), /открыть страницу/);
  const expectedError = { message: "provider error" };
  client.auth.signInWithOAuth = async () => ({ data: null, error: expectedError });
  const result = await adapter(client, async () => ({ ok: true, json: async () => ({ external: { google: true } }) })).signInWithProvider("google");
  assert.equal(result.error, expectedError);
});
test("cloud signup and password recovery return to the configured landing page", async () => {
  let signup, reset;
  const auth = adapter({ auth: {
    signUp: async values => { signup = values; return { data: {}, error: null }; },
    resetPasswordForEmail: async (email, options) => { reset = options; return { data: {}, error: null }; }
  } });
  await auth.signUp("student@example.test", "example-password");
  await auth.sendPasswordReset("student@example.test");
  assert.equal(signup.options.emailRedirectTo, "https://learningpython.vercel.app/");
  assert.equal(reset.redirectTo, "https://learningpython.vercel.app/");
});
test("cloud progress refuses writes if the authenticated account changed", async () => {
  let wrote = false;
  const auth = adapter({
    auth: { getUser: async () => ({ data: { user: { id: "different-account" } }, error: null }) },
    from: () => ({ upsert: async () => { wrote = true; return { error: null }; } })
  });
  await assert.rejects(auth.saveProgress("original-account", { completed: [] }, {}), /Account changed/);
  assert.equal(wrote, false);
});
test("production build contains cloud configuration and excludes server data", () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "kod-build-test-"));
  try {
    const result = spawnSync(process.execPath, ["prepare-vercel.js"], {
      cwd: root, encoding: "utf8",
      env: { ...process.env, VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "learningpython.vercel.app", VERCEL_OUTPUT_DIR: output }
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(fs.readFileSync(path.join(output, "config.js"), "utf8"), /authProvider:\s*"supabase"/);
    assert.match(fs.readFileSync(path.join(output, "index.html"), "utf8"), /rel="canonical" href="https:\/\/learningpython.vercel.app\/"/);
    assert.equal(fs.existsSync(path.join(output, "auth-server.js")), false);
    assert.equal(fs.existsSync(path.join(output, "data")), false);
    assert.equal(fs.existsSync(path.join(output, "learn.html")), true);
  } finally {
    // This test creates only files, so cleanup does not recursively remove directories.
    for (const file of fs.readdirSync(output)) fs.unlinkSync(path.join(output, file));
    fs.rmdirSync(output);
  }
});
