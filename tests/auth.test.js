const { test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { createAuthApi } = require("../auth-server");

async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "kod-auth-test-"));
  const database = path.join(directory, "test.sqlite");
  const api = createAuthApi(database);
  const server = http.createServer((req, res) => api.handle(req, res, req.url));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port;
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    api.close();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  async function call(route, body, cookie = "", headers = {}) {
    const response = await fetch(origin + "/api/" + route, {
      method: body === undefined ? "GET" : "POST",
      headers: { Origin: origin, "Content-Type": "application/json", Cookie: cookie, ...headers },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, body: await response.json(), cookie: response.headers.get("set-cookie"), cache: response.headers.get("cache-control") };
  }
  const signup = email => call("signup", { email, password: "test-password-12345", consent: true });
  return { call, signup, database };
}
test("registration persists only password hashes and issues an HttpOnly session", async t => {
  const { signup, call, database } = await fixture(t);
  const registered = await signup("Student@Example.test");
  assert.equal(registered.status, 201);
  assert.equal(registered.body.user.email, "student@example.test");
  assert.match(registered.cookie, /HttpOnly; SameSite=Strict/);
  assert.equal(registered.cache, "no-store");
  assert.equal(registered.body.recoveryCode.length, 48);
  assert.equal((await call("session", undefined, registered.cookie)).body.session.user.id, registered.body.user.id);
  assert.equal((await signup("student@example.test")).status, 409);
  const db = new DatabaseSync(database);
  const stored = db.prepare("SELECT * FROM users").get();
  assert.notEqual(stored.password_hash, "test-password-12345");
  assert.equal(stored.password_hash.length, 128);
  assert.notEqual(stored.recovery_hash, registered.body.recoveryCode);
  db.close();
});
test("password validation, explicit consent, CSRF and incorrect login are rejected", async t => {
  const { call, signup } = await fixture(t);
  assert.equal((await call("signup", { email: "bad", password: "short" })).status, 400);
  assert.equal((await call("signup", { email: "user@example.test", password: "test-password-12345" })).status, 400);
  assert.equal((await call("signup", {}, "", { Origin: "https://attacker.test" })).status, 403);
  assert.equal((await call("signup", {}, "", { "Content-Type": "text/plain" })).status, 403);
  await signup("user@example.test");
  assert.equal((await call("login", { email: "user@example.test", password: "incorrect-password" })).status, 401);
  assert.equal((await call("login", { email: "nobody@example.test", password: "incorrect-password" })).status, 401);
});
test("progress is persistent and isolated by account; forged ownership is rejected", async t => {
  const { call, signup, database } = await fixture(t);
  const a = await signup("a@example.test"), b = await signup("b@example.test");
  const payload = { userId: a.body.user.id, progress: { completed: [1], quiz: {} }, streak: { days: 1 } };
  assert.equal((await call("progress", payload)).status, 401);
  assert.equal((await call("progress", payload, b.cookie)).status, 400);
  assert.equal((await call("progress", payload, a.cookie)).status, 200);
  assert.deepEqual((await call("progress", undefined, a.cookie)).body.progress.progress.completed, [1]);
  assert.equal((await call("progress", undefined, b.cookie)).body.progress, null);
  const db = new DatabaseSync(database);
  assert.deepEqual(JSON.parse(db.prepare("SELECT payload FROM progress WHERE user_id=?").get(a.body.user.id).payload).progress.completed, [1]);
  db.close();
});
test("logout revokes the server session and login creates another", async t => {
  const { call, signup } = await fixture(t);
  const account = await signup("user@example.test");
  assert.equal((await call("logout", {}, account.cookie)).status, 200);
  assert.equal((await call("session", undefined, account.cookie)).body.session, null);
  const login = await call("login", { email: "USER@example.test", password: "test-password-12345" });
  assert.equal(login.status, 200);
  assert.notEqual(login.cookie, account.cookie);
});
test("recovery rotates the single-use code, revokes old sessions and changes password", async t => {
  const { call, signup } = await fixture(t);
  const account = await signup("user@example.test");
  const values = { email: "user@example.test", password: "new-password-56789", recoveryCode: account.body.recoveryCode };
  assert.equal((await call("recover", { ...values, recoveryCode: "wrong" })).status, 401);
  const recovered = await call("recover", values);
  assert.equal(recovered.status, 200);
  assert.notEqual(recovered.body.recoveryCode, values.recoveryCode);
  assert.equal((await call("session", undefined, account.cookie)).body.session, null);
  assert.equal((await call("recover", values)).status, 401);
  assert.equal((await call("login", { email: values.email, password: "test-password-12345" })).status, 401);
  assert.equal((await call("login", { email: values.email, password: values.password })).status, 200);
});
test("authentication endpoints throttle repeated attempts", async t => {
  const { call } = await fixture(t);
  for (let index = 0; index < 30; index++) await call("login", {});
  assert.equal((await call("login", {})).status, 429);
});
