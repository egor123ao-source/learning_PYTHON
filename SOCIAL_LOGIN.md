# Вход через Google и Discord

Кнопки работают через Supabase Auth с PKCE. После авторизации пользователь возвращается в кабинет на главной странице и может открыть тренажёр. Отдельный пароль сайта при таком входе не нужен. Почтовая регистрация и восстановление пароля остаются доступны.

Пока провайдер выключен, кнопка объясняет, что вход ещё не подключён. После настройки в Supabase сайт подхватит изменения при следующей попытке входа, без новой публикации.

## Общие адреса

В [Supabase → Authentication → URL Configuration](https://supabase.com/dashboard/project/oevmdecyykgndjhzmxfg/auth/url-configuration):

- **Site URL:** https://learningpython.vercel.app/
- Добавить **Redirect URL:** https://learningpython.vercel.app/?auth=oauth
- Сохранить разрешение https://learningpython.vercel.app/ для писем подтверждения и восстановления.

В консолях Google и Discord указать один и тот же **callback / redirect URI**:

    https://oevmdecyykgndjhzmxfg.supabase.co/auth/v1/callback

Это два разных шага: провайдер возвращает пользователя в Supabase, а Supabase — на сайт.

## Google

1. Открыть [Google Cloud Console](https://console.cloud.google.com/), выбрать или создать проект.
2. В Google Auth Platform настроить Branding и Audience. Для внешних пользователей выбрать External. Пока приложение в режиме Testing, добавить нужные адреса в Test users.
3. В Clients создать OAuth client типа **Web application**.
4. Authorized JavaScript origins: https://learningpython.vercel.app
5. Authorized redirect URIs: callback Supabase, указанный выше.
6. Скопировать Client ID и Client Secret в [Supabase → Authentication → Sign In / Providers](https://supabase.com/dashboard/project/oevmdecyykgndjhzmxfg/auth/providers) → Google, включить провайдер и сохранить.
7. Для публичного запуска проверить статус Audience / Publishing и требования Google к проверке приложения.

[Официальная инструкция Google + Supabase](https://supabase.com/docs/guides/auth/social-sign-in/auth-google).

## Discord

1. В [Discord Developer Portal](https://discord.com/developers/applications) создать New Application.
2. В разделе OAuth2 добавить Redirect: callback Supabase, указанный выше, и сохранить.
3. Взять Client ID и Client Secret приложения.
4. В Supabase → Authentication → Sign In / Providers → Discord включить провайдер, вставить эти значения, сохранить.

Создавать бота или добавлять его на сервер для входа не требуется.

[Официальная инструкция Discord + Supabase](https://supabase.com/docs/guides/auth/social-sign-in/auth-discord).

## Где хранить ключи

Client Secret Google/Discord вводятся в панели Supabase. В config.js, GitHub и клиентский JavaScript их добавлять нельзя. Имеющийся publishable key не позволяет настраивать провайдеров.

## Проверка после включения

1. Открыть https://learningpython.vercel.app/#login в обычном браузере.
2. Нажать кнопку провайдера, войти в его аккаунт и разрешить доступ.
3. Должен открыться кабинет на сайте с адресом пользователя.
4. Открыть тренажёр, проверить сохранение прогресса, выйти и войти повторно.
5. Проверить отмену авторизации: сайт должен предложить повторить вход.

## Проверено в коде

Автотесты проверяют два провайдера, разрешённый адрес возврата, отказ для выключенного/неизвестного провайдера, повтор после включения, ошибки сети и запрет перехода на посторонний адрес. Полный вход с реальными аккаунтами возможен после настройки провайдеров владельцем.

Проверка интерфейса в браузере: запустить сервер с PORT=3100, затем выполнить playwright-cli open http://localhost:3100 и playwright-cli run-code --filename=tests/oauth-browser-check.js. Нужен установленный playwright-cli. Скрипт подменяет ответы провайдеров и обмен кода, проверяет мобильную форму, отмену и успешный возврат; реальных аккаунтов не использует. Снимок формы сохраняется в .playwright-cli/oauth-mobile.png. Для Windows используйте playwright-cli.cmd.
