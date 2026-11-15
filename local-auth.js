(function () {
  if (window.APP_CONFIG?.authProvider !== "local") return;
  const listeners = new Set();
  let currentSession = null;
  async function request(route, body) {
    try {
      const response = await fetch("/api/" + route, {
        method: body === undefined ? "GET" : "POST",
        headers: body === undefined ? {} : { "Content-Type": "application/json" },
        credentials: "same-origin", cache: "no-store",
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
      });
      const data = await response.json();
      if (!response.ok) return { data: null, error: new Error(data.error || "Сервис недоступен.") };
      return { data, error: null };
    } catch {
      return { data: null, error: new Error("Нет связи с сервером. Проверьте подключение и попробуйте снова.") };
    }
  }
  function notify(event, session) {
    currentSession = session;
    for (const listener of listeners) listener(event, session);
  }
  async function authenticate(route, values) {
    const result = await request(route, values);
    if (!result.error) notify("SIGNED_IN", result.data.session);
    return result;
  }
  window.APP_AUTH_STATUS = "ready";
  window.APP_AUTH = {
    isConfigured: true, provider: "local",
    signUp: (email, password) => authenticate("signup", { email, password, consent: true }),
    signIn: (email, password) => authenticate("login", { email, password }),
    recover: (email, password, recoveryCode) => authenticate("recover", { email, password, recoveryCode }),
    async getSession() {
      const result = await request("session");
      if (!result.error) currentSession = result.data.session;
      return result;
    },
    onAuthStateChange(callback) {
      listeners.add(callback);
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
    async signOut() {
      const result = await request("logout", {});
      if (!result.error) notify("SIGNED_OUT", null);
      return result;
    },
    async loadProgress() {
      const result = await request("progress");
      if (result.error) throw result.error;
      return result.data.progress;
    },
    async saveProgress(userId, progress, streak) {
      if (currentSession?.user.id !== userId) throw new Error("Аккаунт изменился.");
      const result = await request("progress", { userId, progress, streak });
      if (result.error) throw result.error;
    },
    sendPasswordReset: async () => ({ error: new Error("Восстановите пароль резервным кодом на главной странице.") }),
    updatePassword: async () => ({ error: new Error("Используйте восстановление доступа на главной странице.") })
  };
  window.addEventListener("focus", async () => {
    const previousId = currentSession?.user.id;
    const result = await window.APP_AUTH.getSession();
    if (!result.error && currentSession?.user.id !== previousId) notify(currentSession ? "SIGNED_IN" : "SIGNED_OUT", currentSession);
  });
})();
