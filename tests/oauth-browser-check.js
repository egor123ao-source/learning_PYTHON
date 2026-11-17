async page => {
  const context = await page.context().browser().newContext({ serviceWorkers: "block" });
  const testPage = await context.newPage();
  const navigationCheck = async page => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  await page.route("**/auth/v1/settings", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ external: { google: false, discord: false, apple: false } }) }));
  await page.goto("http://localhost:3100/#login");
  await page.locator("#auth-dialog").waitFor({ state: "visible" });
  for (const name of ["Google", "Discord", "Apple"]) {
    await page.getByRole("button", { name: "Войти через " + name, exact: true }).click();
    await page.waitForFunction(name => document.getElementById("auth-status").textContent.includes(name + " пока не подключён"), name);
    check(await page.locator("#auth-submit").isEnabled(), "Email login locked after " + name);
  }
  await page.getByRole("button", { name: "Не помню пароль", exact: true }).click();
  check(await page.locator(".social-auth").isHidden(), "Social buttons visible during recovery");
  await page.getByRole("button", { name: "Назад ко входу", exact: true }).click();
  await page.getByRole("button", { name: "Регистрация", exact: true }).click();
  await page.setViewportSize({ width: 375, height: 812 });
  check(await page.locator(".social-button:visible").count() === 3, "Missing mobile buttons");
  const rect = await page.locator("#auth-dialog").boundingBox();
  check(rect.x >= 0 && rect.x + rect.width <= 376, "Mobile dialog overflows");
  await page.screenshot({ path: ".playwright-cli/oauth-mobile.png" });
  await page.goto("http://localhost:3100/?auth=oauth#error=access_denied&error_description=Cancelled");
  await page.waitForFunction(() => document.getElementById("auth-status").textContent.includes("Вход отменён"));
  check(!new URL(page.url()).searchParams.has("auth"), "Callback URL not cleaned");
  await page.route("**/auth/v1/settings", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ external: { google: true, discord: true, apple: true } })
  }));
  await page.route("**/auth/v1/authorize?**", route => route.fulfill({
    status: 200, contentType: "text/html", body: "<h1>OAuth navigation intercepted for test</h1>"
  }));
  for (const provider of ["google", "discord", "apple"]) {
    await page.goto("http://localhost:3100/#login");
    await page.locator("#auth-dialog").waitFor({ state: "visible" });
    await page.locator('[data-provider="' + provider + '"]').click();
    await page.waitForURL("**/auth/v1/authorize?**");
    const url = new URL(page.url());
    check(url.searchParams.get("provider") === provider, "Wrong provider");
    check(url.searchParams.get("redirect_to") === "http://localhost:3100/?auth=oauth", "Wrong callback");
    check(url.searchParams.get("code_challenge_method").toLowerCase() === "s256", "PKCE missing");
    check(url.searchParams.get("code_challenge").length > 30, "PKCE challenge missing");
  }
  return "PASS: disabled providers, retry, recovery visibility, 375px dialog, cancellation, SDK navigation and PKCE for all three providers. Real provider sign-in still requires dashboard setup.";
};
  const callbackCheck = async page => {
  const now = Math.floor(Date.now() / 1000);
  const user = { id: "11111111-1111-4111-8111-111111111111", email: "oauth-ui-test@example.test", aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
  const token = [ { alg: "HS256", typ: "JWT" }, { sub: user.id, exp: now + 3600, iat: now, aud: "authenticated", role: "authenticated" } ].map(value => Buffer.from(JSON.stringify(value)).toString("base64url")).join(".") + ".test-signature";
  let exchanged = false;
  await page.route("**/auth/v1/token?grant_type=pkce", route => {
    const body = route.request().postDataJSON();
    if (body.auth_code !== "ui-test-code" || !body.code_verifier) throw new Error("Missing PKCE exchange parameters");
    exchanged = true;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ access_token: token, refresh_token: "ui-test-only", expires_in: 3600, token_type: "bearer", user }) });
  });
  await page.goto("http://localhost:3100/?auth=oauth&code=ui-test-code");
  await page.locator("#profile-panel").waitFor({ state: "visible" });
  if (!exchanged) throw new Error("No code exchange");
  if (await page.locator("#profile-email").textContent() !== user.email) throw new Error("Missing account email");
  if (new URL(page.url()).search) throw new Error("Callback parameters left in address bar");
  await page.evaluate(() => localStorage.clear());
  return "PASS: mocked successful token exchange opens the profile and removes the callback code. No real provider account was used.";
};
  try {
    return [await navigationCheck(testPage), await callbackCheck(testPage)];
  } finally {
    await context.close();
  }
}
