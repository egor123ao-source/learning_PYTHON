const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");
const root = path.join(__dirname, "..");

function adapter(client) {
  const context = { URL, console, window: {
    APP_CONFIG: { authProvider: "supabase", supabaseUrl: "https://test.supabase.co", supabaseAnonKey: "public-key" },
    location: { href: "https://learningpython.vercel.app/learn.html" },
    supabase: { createClient: () => client }
  } };
  vm.runInNewContext(fs.readFileSync(path.join(root, "auth.js"), "utf8"), context);
  return context.window.APP_AUTH;
}
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
