const { DatabaseSync } = require("node:sqlite");
const { randomBytes, randomUUID, scrypt, timingSafeEqual, createHash } = require("node:crypto");
const { promisify } = require("node:util");
const fs = require("node:fs");
const path = require("node:path");
const derive = promisify(scrypt);
const digest = value => createHash("sha256").update(value).digest("hex");
const SESSION_AGE = 7 * 24 * 60 * 60;

function createAuthApi(databasePath = process.env.DATABASE_PATH || path.join(__dirname, "data", "accounts.sqlite")) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;");
  db.exec([
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL, recovery_hash TEXT NOT NULL, created_at INTEGER NOT NULL);",
    "CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);",
    "CREATE TABLE IF NOT EXISTS progress (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, payload TEXT NOT NULL);"
  ].join("\n"));
  const attempts = new Map();
  const dummySalt = randomBytes(16).toString("hex");
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
  const cookie = (token, age) => "kod_session=" + token + "; HttpOnly; SameSite=Strict; Path=/; Max-Age=" + age + (secure ? "; Secure" : "");
  const json = (response, status, value) => {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end(JSON.stringify(value));
  };
  function tokenOf(request) {
    return (request.headers.cookie || "").split(";").map(s => s.trim()).find(s => s.startsWith("kod_session="))?.slice(12) || "";
  }
  function userOf(request) {
    return db.prepare("SELECT u.id, u.email FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?").get(digest(tokenOf(request)), Date.now()) || null;
  }
  function startSession(response, user) {
    const token = randomBytes(32).toString("hex");
    db.prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now());
    db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(digest(token), user.id, Date.now() + SESSION_AGE * 1000);
    response.setHeader("Set-Cookie", cookie(token, SESSION_AGE));
  }
  async function readBody(request) {
    let length = 0;
    const chunks = [];
    for await (const chunk of request) {
      length += chunk.length;
      if (length > 262144) throw Object.assign(new Error("Слишком большой запрос."), { status: 413 });
      chunks.push(chunk);
    }
    try {
      const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
      return value;
    } catch { throw Object.assign(new Error("Некорректный JSON."), { status: 400 }); }
  }
  function limited(request) {
    const now = Date.now();
    for (const [key, item] of attempts) if (item.until < now) attempts.delete(key);
    const ip = request.socket.remoteAddress || "local";
    const item = attempts.get(ip) || { count: 0, until: now + 15 * 60000 };
    item.count++;
    attempts.set(ip, item);
    return item.count > 30;
  }
  const safeUser = user => ({ id: user.id, email: user.email });
  async function handle(request, response, pathname) {
    if (!pathname.startsWith("/api/")) return false;
    try {
      if (request.method === "GET") {
        if (pathname === "/api/session") {
          const user = userOf(request);
          json(response, 200, { session: user ? { user } : null });
        } else if (pathname === "/api/progress") {
          const user = userOf(request);
          if (!user) json(response, 401, { error: "Войдите в аккаунт." });
          else json(response, 200, { progress: JSON.parse(db.prepare("SELECT payload FROM progress WHERE user_id=?").get(user.id)?.payload || "null") });
        } else json(response, 404, { error: "Маршрут не найден." });
        return true;
      }
      if (request.method !== "POST") { json(response, 405, { error: "Метод не поддерживается." }); return true; }
      const expectedOrigin = process.env.PUBLIC_ORIGIN || (secure ? "https://" : "http://") + request.headers.host;
      if (request.headers.origin !== expectedOrigin || !request.headers["content-type"]?.startsWith("application/json")) {
        json(response, 403, { error: "Недопустимый источник запроса." }); return true;
      }
      if (["/api/signup", "/api/login", "/api/recover"].includes(pathname) && limited(request)) {
        response.setHeader("Retry-After", "900");
        json(response, 429, { error: "Слишком много попыток. Попробуйте через 15 минут." }); return true;
      }
      const body = await readBody(request);
      if (["/api/signup", "/api/login", "/api/recover"].includes(pathname)) {
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || password.length > 128 || password.length < (pathname === "/api/login" ? 1 : 12)) {
          json(response, 400, { error: "Введите корректную почту и пароль от 12 до 128 символов." }); return true;
        }
        if (pathname === "/api/signup") {
          if (body.consent !== true) { json(response, 400, { error: "Нужно согласие на обработку данных." }); return true; }
          const salt = randomBytes(16).toString("hex");
          const passwordHash = (await derive(password, salt, 64)).toString("hex");
          const recoveryCode = randomBytes(24).toString("hex");
          const user = { id: randomUUID(), email };
          try {
            db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)").run(user.id, email, passwordHash, salt, digest(recoveryCode), Date.now());
          } catch (error) {
            if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
              json(response, 409, { error: "Не удалось создать аккаунт. Попробуйте войти или восстановить доступ." }); return true;
            }
            throw error;
          }
          startSession(response, user);
          json(response, 201, { user, session: { user }, recoveryCode });
        } else {
          const stored = db.prepare("SELECT * FROM users WHERE email=?").get(email);
          if (pathname === "/api/login") {
            const hash = await derive(password, stored?.salt || dummySalt, 64);
            if (!stored || !timingSafeEqual(hash, Buffer.from(stored.password_hash, "hex"))) {
              json(response, 401, { error: "Неверная почта или пароль." }); return true;
            }
            const user = safeUser(stored);
            startSession(response, user);
            json(response, 200, { user, session: { user } });
          } else {
            const code = typeof body.recoveryCode === "string" ? body.recoveryCode.trim() : "";
            const recoveryHash = digest(code);
            if (!stored || !code || !timingSafeEqual(Buffer.from(recoveryHash, "hex"), Buffer.from(stored.recovery_hash, "hex"))) {
              json(response, 401, { error: "Не удалось восстановить доступ. Проверьте почту и резервный код." }); return true;
            }
            const salt = randomBytes(16).toString("hex");
            const passwordHash = (await derive(password, salt, 64)).toString("hex");
            const recoveryCode = randomBytes(24).toString("hex");
            const changed = db.prepare("UPDATE users SET password_hash=?,salt=?,recovery_hash=? WHERE id=? AND recovery_hash=?").run(passwordHash, salt, digest(recoveryCode), stored.id, recoveryHash);
            if (!changed.changes) { json(response, 401, { error: "Код уже использован." }); return true; }
            db.prepare("DELETE FROM sessions WHERE user_id=?").run(stored.id);
            const user = safeUser(stored);
            startSession(response, user);
            json(response, 200, { user, session: { user }, recoveryCode });
          }
        }
      } else if (pathname === "/api/logout") {
        db.prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(tokenOf(request)));
        response.setHeader("Set-Cookie", cookie("", 0));
        json(response, 200, {});
      } else if (pathname === "/api/progress") {
        const user = userOf(request);
        if (!user) { json(response, 401, { error: "Войдите в аккаунт." }); return true; }
        if (body.userId !== user.id || !body.progress || !Array.isArray(body.progress.completed) || !body.streak || typeof body.streak !== "object") {
          json(response, 400, { error: "Некорректный прогресс или аккаунт." }); return true;
        }
        db.prepare("INSERT INTO progress VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload").run(user.id, JSON.stringify({ progress: body.progress, streak: body.streak }));
        json(response, 200, {});
      } else json(response, 404, { error: "Маршрут не найден." });
    } catch (error) {
      if (!error.status) console.error("API error:", error.code || error.name);
      if (!response.headersSent) json(response, error.status || 500, { error: error.status ? error.message : "Ошибка сервера. Попробуйте позже." });
    }
    return true;
  }
  return { handle, close: () => db.close() };
}
module.exports = { createAuthApi };
