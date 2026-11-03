(function () {
  const config = window.APP_CONFIG || {};
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
  window.APP_AUTH = {
    client,
    isConfigured: true,
    async signUp(email, password) {
      return client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
    },
    async signIn(email, password) {
      return client.auth.signInWithPassword({ email, password });
    },
    async sendPasswordReset(email) {
      return client.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
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
