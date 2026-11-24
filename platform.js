(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const menu = document.querySelector(".menu-toggle");
  function closeMenu() { menu.setAttribute("aria-expanded", "false"); $("navigation").classList.remove("open"); }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open)); $("navigation").classList.toggle("open", open);
  });
  $("navigation").addEventListener("click", closeMenu);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
  document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  }));

  // The same auth adapter is shared with the existing lesson application.
  const local = window.APP_CONFIG?.authProvider === "local";
  let user = null, mode = "signup", busy = false;
  const oauthReturn = new URL(location.href).searchParams.get("auth") === "oauth";
  const callbackParams = new URLSearchParams(location.hash.slice(1));
  const callbackError = new URL(location.href).searchParams.get("error") || callbackParams.get("error");
  const socialPanel = document.createElement("div");
  socialPanel.className = "social-auth";
  socialPanel.hidden = local;
  for (const [provider, name] of [["google", "Google"], ["discord", "Discord"]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button secondary full-width social-button";
    button.dataset.provider = provider;
    button.textContent = "Войти через " + name;
    button.addEventListener("click", () => startSocialLogin(provider, name));
    socialPanel.append(button);
  }
  const socialNote = document.createElement("p");
  socialNote.className = "social-note";
  socialNote.innerHTML = 'При первом входе создадим аккаунт. Продолжая, вы соглашаетесь с <a href="privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a>.';
  socialPanel.append(socialNote);
  const divider = document.createElement("p");
  divider.className = "auth-divider";
  divider.textContent = "или по электронной почте";
  socialPanel.append(divider);
  $("auth-form").before($("auth-status"), socialPanel);
  function setBusy(value) {
    busy = value;
    $("auth-dialog").setAttribute("aria-busy", String(value));
    $("auth-submit").disabled = value;
    socialPanel.querySelectorAll("button").forEach(button => { button.disabled = value; });
    document.querySelectorAll("[data-auth-mode]").forEach(button => { button.disabled = value; });
    $("forgot-password").disabled = value;
  }
  async function startSocialLogin(provider, name) {
    if (busy) return;
    if (!window.APP_AUTH?.signInWithProvider) {
      status("Сервис входа недоступен. Попробуйте позже.", true);
      return;
    }
    setBusy(true);
    status("Открываем " + name + "…");
    let navigating = false;
    try {
      const result = await window.APP_AUTH.signInWithProvider(provider);
      if (result.error) throw result.error;
      window.location.assign(result.data.url);
      navigating = true;
    } catch (error) { status(friendlyError(error), true); }
    finally { if (!navigating) setBusy(false); }
  }
  window.addEventListener("pageshow", event => {
    if (event.persisted) { setBusy(false); status(""); }
  });
  const labels = {
    signup: ["Рады знакомству", "Создайте аккаунт, чтобы ваш прогресс был рядом.", "Создать аккаунт"],
    login: ["С возвращением", "Продолжим с того места, где остановились?", "Войти"],
    reset: ["Вернёмся к учёбе", local ? "Введите почту, резервный код и новый пароль." : "Пришлём ссылку для восстановления на вашу почту.", local ? "Сменить пароль" : "Отправить ссылку"],
    recovery: ["Новый пароль", "Придумайте новый пароль для вашего аккаунта.", "Сохранить пароль"],
    profile: ["Ваше пространство", "Следующий маленький шаг уже ждёт вас.", ""]
  };
  const recoveryField = document.createElement("div");
  recoveryField.id = "recovery-field";
  recoveryField.innerHTML = '<label for="recovery-code">Резервный код</label><input id="recovery-code" type="text" autocomplete="off" maxlength="48" spellcheck="false">';
  $("password-field").before(recoveryField);
  const codePanel = document.createElement("div");
  codePanel.id = "recovery-panel"; codePanel.hidden = true;
  codePanel.innerHTML = '<strong>Сохраните резервный код</strong><p>Он нужен для восстановления пароля. Показываем его только сейчас. Храните код в менеджере паролей.</p><code id="new-recovery-code"></code><button type="button" class="button secondary full-width" id="download-code">Скачать код</button>';
  $("profile-panel").prepend(codePanel);
  function status(message, error = false) { $("auth-status").textContent = message; $("auth-status").classList.toggle("error", error); }
  function setMode(next) {
    mode = next;
    const [title, description, submit] = labels[mode];
    $("auth-title").textContent = title;
    $("auth-description").textContent = description;
    $("auth-submit").textContent = submit;
    $("auth-tabs").hidden = !["signup", "login"].includes(mode);
    socialPanel.hidden = local || !["signup", "login"].includes(mode);
    $("auth-form").hidden = mode === "profile";
    $("profile-panel").hidden = mode !== "profile";
    $("profile-email").textContent = user?.email || "";
    $("auth-email").hidden = $("email-label").hidden = mode === "recovery";
    $("auth-email").required = mode !== "recovery";
    $("password-field").hidden = mode === "reset" && !local;
    $("auth-password").required = !$("password-field").hidden;
    $("auth-password").minLength = mode === "login" ? 1 : 12;
    $("auth-password").autocomplete = mode === "login" ? "current-password" : "new-password";
    $("auth-password").value = "";
    $("auth-password").type = "password";
    $("toggle-password").textContent = "Показать";
    $("toggle-password").setAttribute("aria-label", "Показать пароль");
    $("toggle-password").setAttribute("aria-pressed", "false");
    $("password-hint").hidden = mode === "login";
    $("signup-consent").hidden = mode !== "signup";
    $("consent").required = mode === "signup";
    recoveryField.hidden = !(local && mode === "reset");
    $("recovery-code").required = !recoveryField.hidden;
    $("forgot-password").hidden = mode === "recovery";
    $("forgot-password").textContent = mode === "reset" ? "Назад ко входу" : "Не помню пароль";
    document.querySelectorAll("[data-auth-mode]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.authMode === mode)));
    status("");
  }
  function openAuth(next) {
    if (busy) return;
    setMode(user && next !== "recovery" ? "profile" : next);
    if (!$("auth-dialog").open) $("auth-dialog").showModal();
  }
  document.querySelectorAll("[data-auth]").forEach(button => button.addEventListener("click", () => openAuth(button.dataset.auth)));
  document.querySelectorAll("[data-auth-mode]").forEach(button => button.addEventListener("click", () => { if (!busy) setMode(button.dataset.authMode); }));
  $("forgot-password").addEventListener("click", () => { if (!busy) setMode(mode === "reset" ? "login" : "reset"); });
  $("toggle-password").addEventListener("click", () => {
    const show = $("auth-password").type === "password";
    $("auth-password").type = show ? "text" : "password";
    $("toggle-password").textContent = show ? "Скрыть" : "Показать";
    $("toggle-password").setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
    $("toggle-password").setAttribute("aria-pressed", String(show));
  });
  function showRecoveryCode(code) {
    $("new-recovery-code").textContent = code;
    codePanel.hidden = false;
  }
  $("download-code").addEventListener("click", () => {
    const content = "Код — восстановление доступа\nАккаунт: " + user.email + "\nРезервный код: " + $("new-recovery-code").textContent + "\nХраните этот файл в безопасном месте.";
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "kod-recovery.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  function friendlyError(error) {
    const message = error?.message || "";
    if (/invalid login/i.test(message)) return "Неверная почта или пароль.";
    if (/email not confirmed/i.test(message)) return "Подтвердите почту по ссылке из письма, затем войдите.";
    if (/rate limit|too many/i.test(message)) return "Слишком много попыток. Попробуйте позже.";
    if (/fetch|network/i.test(message)) return "Нет связи с сервисом регистрации. Попробуйте позже.";
    if (error?.name === "TimeoutError" || error?.name === "AbortError") return "Сервис входа долго не отвечает. Попробуйте ещё раз.";
    return message || "Не удалось выполнить действие. Попробуйте ещё раз.";
  }
  function updateUser(next) {
    user = next;
    document.querySelector(".login-button").textContent = user ? "Мой кабинет ↗" : "Войти ↗";
    if (mode === "profile" && !user) {
      codePanel.hidden = true; $("new-recovery-code").textContent = ""; setMode("login");
    }
  }
  $("auth-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (busy || !$("auth-form").reportValidity()) return;
    if (!window.APP_AUTH) { status("Сервис регистрации недоступен. Попробуйте позже; уроки доступны без входа.", true); return; }
    const submittedMode = mode, email = $("auth-email").value.trim(), password = $("auth-password").value;
    setBusy(true);
    $("auth-form").setAttribute("aria-busy", "true");
    status("Секунду, выполняем запрос…");
    try {
      let result;
      if (submittedMode === "signup") result = await window.APP_AUTH.signUp(email, password);
      else if (submittedMode === "login") result = await window.APP_AUTH.signIn(email, password);
      else if (submittedMode === "reset") result = local ? await window.APP_AUTH.recover(email, password, $("recovery-code").value) : await window.APP_AUTH.sendPasswordReset(email);
      else result = await window.APP_AUTH.updatePassword(password);
      if (result.error) throw result.error;
      $("auth-password").value = ""; $("recovery-code").value = "";
      if (result.data?.session) {
        updateUser(result.data.session.user); setMode("profile");
        if (result.data.recoveryCode) showRecoveryCode(result.data.recoveryCode);
      } else if (submittedMode === "signup") status("Проверьте почту: если адрес доступен для регистрации, вы получите письмо с подтверждением.");
      else if (submittedMode === "reset") status("Если для этого адреса есть аккаунт, на почту придёт ссылка для восстановления.");
      else if (submittedMode === "recovery") { setMode("profile"); $("profile-status").textContent = "Пароль обновлён."; }
    } catch (error) { status(friendlyError(error), true); }
    finally { setBusy(false); $("auth-form").removeAttribute("aria-busy"); }
  });
  $("logout").addEventListener("click", async () => {
    $("logout").disabled = true;
    try {
      const result = await window.APP_AUTH.signOut();
      if (result.error) throw result.error;
      updateUser(null); setMode("login"); codePanel.hidden = true; $("new-recovery-code").textContent = "";
      status("Вы вышли из аккаунта.");
    } catch (error) { $("profile-status").textContent = friendlyError(error); $("profile-status").classList.add("error"); }
    finally { $("logout").disabled = false; }
  });
  if (window.APP_AUTH) {
    window.APP_AUTH.onAuthStateChange((event, session) => {
      updateUser(session?.user || null);
      if (event === "PASSWORD_RECOVERY") openAuth("recovery");
    });
    window.APP_AUTH.getSession().then(result => {
      if (!result.error) updateUser(result.data?.session?.user || null);
      if (oauthReturn) {
        openAuth("login");
        if (!user || result.error || callbackError) {
          status(callbackError === "access_denied" ? "Вход отменён. Выберите способ входа и попробуйте снова." : "Не удалось завершить вход. Попробуйте снова в этом браузере.", true);
        }
        const cleanUrl = new URL(location.href);
        ["auth", "code", "error", "error_code", "error_description"].forEach(key => cleanUrl.searchParams.delete(key));
        cleanUrl.hash = "";
        history.replaceState(null, "", cleanUrl);
      }
      if (location.hash === "#login" || location.hash === "#signup" || location.hash === "#reset") openAuth(location.hash.slice(1));
    }).catch(() => {
      if (oauthReturn) { openAuth("login"); status("Не удалось завершить вход. Попробуйте ещё раз.", true); }
    });
  }
  const authError = new URLSearchParams(location.hash.slice(1)).get("error_description");
  if (authError && !oauthReturn) { openAuth("login"); status("Ссылка устарела или недействительна. Запросите восстановление ещё раз.", true); }

  let worker = null, runId = 0, timer;
  function finishRun(text, terminate = false) {
    clearTimeout(timer); $("demo-output").textContent = text; $("run-demo").disabled = false; $("run-demo").textContent = "▶ Запустить";
    if (terminate) { worker?.terminate(); worker = null; }
  }
  function armTimeout(delay, message) { clearTimeout(timer); timer = setTimeout(() => finishRun(message, true), delay); }
  $("run-demo").addEventListener("click", () => {
    const code = $("demo-code").value.trim();
    if (!code) { $("demo-output").textContent = "Сначала напишите хотя бы одну строку кода."; return; }
    $("run-demo").disabled = true; $("run-demo").textContent = "Запускаем…";
    $("demo-output").textContent = "Загружаем Python. Первый запуск может занять до двух минут.";
    const id = ++runId;
    try {
      if (!worker) {
        worker = new Worker("./python-worker.js");
        worker.onmessage = event => {
          if (event.data.id !== runId) return;
          if (event.data.status === "loading") return;
          if (event.data.status === "ready") { $("demo-output").textContent = "Выполняем программу…"; armTimeout(10000, "Выполнение остановлено: программа работает слишком долго."); return; }
          finishRun(event.data.ok ? event.data.output || "Программа выполнена без вывода." : "Ошибка Python: " + event.data.error);
        };
        worker.onerror = () => finishRun("Не удалось запустить Python. Проверьте интернет и попробуйте ещё раз.", true);
      }
      armTimeout(120000, "Не удалось загрузить Python. Проверьте доступ к интернету и повторите запуск.");
      worker.postMessage({ id, code });
    } catch { finishRun("Этот браузер не смог запустить Python. Попробуйте другой браузер.", true); }
  });
  window.addEventListener("pagehide", () => { clearTimeout(timer); worker?.terminate(); worker = null; });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
})();
