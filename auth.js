(function () {
  const config = window.APP_CONFIG || {};
  if (config.authProvider === "local") return;
  const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);

  if (!configured) {
    window.APP_AUTH_STATUS = "unconfigured";
    window.APP_AUTH = null;
    return;
  }

  if (!window.supabase?.createClient) {
    window.APP_AUTH_STATUS = "unavailable";
    console.error("Не удалось загрузить клиент Supabase Auth.");
    window.APP_AUTH = null;
    return;
  }

  let client;
  try {
    const url = new URL(config.supabaseUrl);
    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      throw new Error("Supabase URL must use HTTPS.");
    }
    if (!url.hostname.endsWith(".supabase.co") && url.hostname !== "localhost") {
      throw new Error("Supabase URL must point to a Supabase project.");
    }
    client = window.supabase.createClient(url.origin, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        persistSession: true
      }
    });
  } catch (error) {
    window.APP_AUTH_STATUS = "invalid";
    console.error("Некорректная конфигурация Supabase:", error);
    window.APP_AUTH = null;
    return;
  }

  window.APP_AUTH_STATUS = "ready";
  // Both pages return to the landing page, where confirmation and recovery are handled.
  const redirectTo = new URL("./", window.location.href).href;
  window.APP_AUTH = {
    client,
    isConfigured: true,
    async signUp(email, password) {
      return client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo }
      });
    },
    async signIn(email, password) {
      return client.auth.signInWithPassword({ email, password });
    },
    async signInWithProvider(provider) {
      const names = { google: "Google", discord: "Discord", apple: "Apple" };
      if (!Object.hasOwn(names, provider)) throw new Error("Неизвестный способ входа.");
      // Check every attempt: enabling a provider in the dashboard needs no redeploy.
      const response = await fetch(new URL("/auth/v1/settings", config.supabaseUrl), {
        headers: { apikey: config.supabaseAnonKey },
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error("Не удалось проверить доступность входа. Попробуйте позже.");
      const settings = await response.json();
      if (settings.external?.[provider] !== true) {
        throw new Error("Вход через " + names[provider] + " пока не подключён. Используйте почту и пароль.");
      }
      const result = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo + "?auth=oauth", skipBrowserRedirect: true }
      });
      if (!result.error) {
        const target = new URL(result.data?.url);
        if (target.origin !== new URL(config.supabaseUrl).origin || target.pathname !== "/auth/v1/authorize") {
          throw new Error("Не удалось открыть страницу входа. Попробуйте ещё раз.");
        }
      }
      return result;
    },
    async sendPasswordReset(email) {
      return client.auth.resetPasswordForEmail(email, {
        redirectTo
      });
    },
    async updatePassword(password) {
      return client.auth.updateUser({ password });
    },
    async signOut() {
      return client.auth.signOut();
    },
    async getSession() {
      return client.auth.getSession();
    },
    onAuthStateChange(callback) {
      return client.auth.onAuthStateChange(callback);
    },
    async loadProgress() {
      const { data, error } = await client
        .from("learning_progress")
        .select("progress, streak")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    async saveProgress(userId, progress, streak) {
      const { data: userResult, error: userError } = await client.auth.getUser();
      if (userError) throw userError;
      if (userResult.user?.id !== userId) {
        throw new Error("Account changed before progress sync completed.");
      }
      const { error } = await client.from("learning_progress").upsert(
        { user_id: userId, progress, streak, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
      if (error) throw error;
    }
  };
})();
