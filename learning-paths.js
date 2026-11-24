(() => {
  "use strict";

  const directions = {
    code: { name: "Разработка", mark: "</>", tone: "lilac", skill: "Код и сайты" },
    data: { name: "Аналитика", mark: "▂▅█", tone: "mint", skill: "Запросы и отчёты" },
    design: { name: "Дизайн", mark: "Aa", tone: "peach", skill: "Макеты и прототипы" },
    ai: { name: "ИИ и ML", mark: "✳", tone: "yellow", skill: "Данные и модели" },
    qa: { name: "Тестирование", mark: "✓_", tone: "blue", skill: "Проверки и баг-репорты" },
    devops: { name: "DevOps", mark: "$_", tone: "ice", skill: "Контейнеры и релизы" },
    mobile: { name: "Мобильная разработка", mark: "[ ]", tone: "pink", skill: "Приложения и экраны" },
    product: { name: "Управление продуктом", mark: "↗", tone: "lime", skill: "Гипотезы и метрики" }
  };

  const formats = { practice: "Практика", guide: "Самостоятельно", program: "Программа школы" };
  const levels = { start: "С нуля", next: "С базовыми знаниями" };

  const courses = [
    { id: "python", title: "Python с нуля", provider: "Код", category: "code", format: "practice", level: "start", free: true, lang: "RU / EN", mark: "Py", keywords: "питон программирование",
      topics: "Python, алгоритмы", description: "90 уроков с теорией, тестами и запуском кода в браузере.", firstStep: "Измените первую программу так, чтобы она выводила ваше имя.", url: "learn.html" },
    { id: "sql", title: "SQL для анализа данных", provider: "SQLBolt", category: "data", format: "practice", level: "start", free: true, lang: "EN", mark: "SQL",
      topics: "SQL, запросы, таблицы", description: "Пишите запросы и сразу проверяйте результат на учебной базе данных.", firstStep: "Выберите из таблицы нужные столбцы и отфильтруйте строки с помощью WHERE.", url: "https://sqlbolt.com/" },
    { id: "figma", title: "Основы дизайна интерфейсов", provider: "Figma", category: "design", format: "guide", level: "start", free: true, lang: "EN", mark: "Aa",
      topics: "Figma, UI, UX, прототипы", description: "Разберитесь в композиции, типографике и создании прототипов.", firstStep: "Соберите один экран приложения и выделите на нём главное действие.", url: "https://www.figma.com/resource-library/design-basics/" },
    { id: "elements-ai", title: "Введение в искусственный интеллект", provider: "Elements of AI", category: "ai", format: "guide", level: "start", free: true, lang: "EN", mark: "AI",
      topics: "ИИ, ML, модели, вероятность", description: "Разберитесь, какие задачи решает ИИ и где у него есть ограничения.", firstStep: "Выберите знакомое приложение и определите, какие задачи в нём решает ИИ.", url: "https://www.elementsofai.com/" },
    { id: "qa-engineer", title: "Инженер по тестированию", provider: "Яндекс Практикум", category: "qa", format: "program", level: "start", free: false, lang: "RU", mark: "QA",
      topics: "QA, ручное тестирование, баг-репорты", description: "Изучайте тест-дизайн, проверку веб-приложений и описание дефектов.", firstStep: "Составьте чек-лист проверки формы регистрации с валидными и ошибочными данными.", url: "https://practicum.yandex.kz/qa-engineer/" },
    { id: "git", title: "Git на практике", provider: "Learn Git Branching", category: "devops", format: "practice", level: "start", free: true, lang: "RU / EN", mark: "git",
      topics: "Git, ветки, коммиты, слияние", description: "Потренируйтесь работать с ветками и следите за историей коммитов на схеме.", firstStep: "Создайте ветку, сделайте коммит и объедините изменения с основной веткой.", url: "https://learngitbranching.js.org/?locale=ru_RU" },
    { id: "android", title: "Разработка для Android", provider: "Android Developers", category: "mobile", format: "guide", level: "start", free: true, lang: "EN", mark: "Kt",
      topics: "Android, Kotlin, Compose", description: "Освойте основы Kotlin и соберите первые экраны с Jetpack Compose.", firstStep: "Соберите экран с текстом и изображением по первому проекту курса.", url: "https://developer.android.com/courses/android-basics-compose/course" },
    { id: "product-basics", title: "Основы продуктовой работы", provider: "Atlassian", category: "product", format: "guide", level: "start", free: true, lang: "EN", mark: "PM",
      topics: "Продукт, roadmap, приоритеты", description: "Поймите, как команда выбирает задачи, ставит цели и строит дорожную карту.", firstStep: "Запишите одну проблему пользователей и предложите метрику улучшения.", url: "https://www.atlassian.com/agile/product-management" },
    { id: "javascript", title: "JavaScript с нуля", provider: "Code Basics", category: "code", format: "practice", level: "start", free: true, lang: "RU", mark: "JS", keywords: "джаваскрипт программирование",
      topics: "JavaScript, frontend, сайты", description: "Познакомьтесь с языком интерактивных сайтов и решите первые упражнения.", firstStep: "Напишите функцию, которая принимает имя и возвращает приветствие.", url: "https://code-basics.com/ru/languages/javascript" },
    { id: "analytics", title: "Аналитик данных", provider: "Яндекс Практикум", category: "data", format: "program", level: "start", free: false, lang: "RU", mark: "BI",
      topics: "SQL, Python, визуализация", description: "Учитесь проверять гипотезы, визуализировать данные и объяснять выводы.", firstStep: "Возьмите сводку расходов за неделю и проверьте, какая категория занимает наибольшую долю.", url: "https://practicum.yandex.kz/data-analyst/" },
    { id: "web-design", title: "Веб-дизайн", provider: "Skillbox", category: "design", format: "program", level: "start", free: false, lang: "RU", mark: "UI",
      topics: "Figma, композиция, дизайн сайтов", description: "Создавайте макеты сайтов, работайте с сеткой и визуальной иерархией.", firstStep: "Набросайте первый экран сайта и определите, что посетитель должен заметить первым.", url: "https://skillbox.kz/course/profession-webdesigner/" },
    { id: "ml", title: "Машинное обучение на практике", provider: "Google for Developers", category: "ai", format: "practice", level: "next", free: true, lang: "EN", mark: "ML",
      topics: "Python, классификация, регрессия", description: "Разберите основы ML и поработайте с моделями в учебных ноутбуках.", firstStep: "Запустите упражнение по линейной регрессии и сравните прогноз с наблюдениями.", url: "https://developers.google.com/machine-learning/crash-course" },
    { id: "postman", title: "Первые проверки API", provider: "Postman", category: "qa", format: "practice", level: "start", free: true, lang: "EN", mark: "API",
      topics: "Postman, API, HTTP, JSON", description: "Отправьте учебный запрос и разберите код ответа, заголовки и JSON.", firstStep: "Отправьте запрос к учебному API и проверьте статус и обязательное поле ответа.", url: "https://learning.postman.com/docs/getting-started/quick-start/" },
    { id: "docker", title: "Старт с Docker", provider: "Docker", category: "devops", format: "guide", level: "next", free: true, lang: "EN", mark: "ctr",
      topics: "Контейнеры, Docker, образы", description: "Разберитесь, как упаковать приложение в образ и запустить его в контейнере.", firstStep: "Запустите учебный контейнер и посмотрите его логи.", url: "https://docs.docker.com/learn/" },
    { id: "flutter", title: "Приложения на Flutter", provider: "Flutter", category: "mobile", format: "practice", level: "start", free: true, lang: "EN", mark: "Dart",
      topics: "Flutter, Dart, виджеты", description: "Изучите Dart и соберите многоэкранное приложение из виджетов.", firstStep: "Запустите первый пример и добавьте кнопку, которая меняет текст на экране.", url: "https://docs.flutter.dev/learn/pathway" },
    { id: "product-manager", title: "Продакт-менеджмент", provider: "Яндекс Практикум", category: "product", format: "program", level: "start", free: false, lang: "RU", mark: "PM",
      topics: "Гипотезы, метрики, исследования", description: "Исследуйте потребности пользователей и принимайте решения на основе данных.", firstStep: "Сформулируйте гипотезу о пользе новой функции и способ её проверить.", url: "https://practicum.yandex.kz/product-manager/" },
    { id: "web", title: "Веб-разработка", provider: "MDN", category: "code", format: "guide", level: "start", free: true, lang: "RU / EN", mark: "Web",
      topics: "HTML, CSS, JavaScript, frontend", description: "Соберите первую страницу и познакомьтесь с инструментами фронтенда.", firstStep: "Создайте HTML-страницу и настройте её вёрстку через отдельный CSS-файл.", url: "https://developer.mozilla.org/ru/docs/Learn_web_development" },
    { id: "pandas", title: "Табличные данные в Python", provider: "Kaggle", category: "data", format: "practice", level: "next", free: true, lang: "EN", mark: "pd",
      topics: "Python, pandas, CSV, DataFrame", description: "Фильтруйте, объединяйте и группируйте таблицы в учебных ноутбуках.", firstStep: "Загрузите CSV и сгруппируйте значения по одному из столбцов.", url: "https://www.kaggle.com/learn/pandas" },
    { id: "accessibility", title: "Доступность интерфейсов", provider: "W3C WAI", category: "design", format: "guide", level: "next", free: true, lang: "RU / EN", mark: "A11y",
      topics: "Доступность, UX, WCAG, a11y", description: "Узнайте, как проектировать сайты для людей с разными возможностями.", firstStep: "Пройдите знакомый интерфейс с клавиатуры и отметьте, где теряется фокус.", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
    { id: "llm", title: "Языковые модели", provider: "Hugging Face", category: "ai", format: "guide", level: "next", free: true, lang: "EN", mark: "LLM",
      topics: "Python, LLM, NLP, Transformers", description: "Разберите принципы работы трансформеров и попробуйте готовую модель.", firstStep: "Запустите учебный пример классификации текста и сравните ответы на двух фразах.", url: "https://huggingface.co/learn/llm-course/chapter1/1" },
    { id: "playwright", title: "Автотесты для браузера", provider: "Playwright", category: "qa", format: "guide", level: "next", free: true, lang: "EN", mark: "E2E",
      topics: "Playwright, JavaScript, тесты, E2E", description: "Настройте автоматические проверки и отследите результат выполнения тестов.", firstStep: "Напишите тест, который открывает учебную страницу и проверяет её заголовок.", url: "https://playwright.dev/docs/intro" },
    { id: "devops-course", title: "DevOps для разработки", provider: "Яндекс Практикум", category: "devops", format: "program", level: "next", free: false, lang: "RU", mark: "CI",
      topics: "Linux, CI/CD, инфраструктура", description: "Освойте сборку, автоматизацию релизов и сопровождение приложений.", firstStep: "Опишите последовательность шагов от коммита до выпуска версии своего проекта.", url: "https://practicum.yandex.kz/devops/" },
    { id: "swiftui", title: "Интерфейсы на SwiftUI", provider: "Apple Developer", category: "mobile", format: "guide", level: "next", free: true, lang: "EN", mark: "iOS",
      topics: "Swift, SwiftUI, iOS, Xcode", description: "Соберите интерфейс для iOS по пошаговым урокам Apple. Для практики нужен Mac.", firstStep: "Откройте учебный проект в Xcode и добавьте строку в список мест.", url: "https://developer.apple.com/tutorials/swiftui" },
    { id: "discovery", title: "Проверка продуктовых гипотез", provider: "Product Talk", category: "product", format: "guide", level: "next", free: true, lang: "EN", mark: "OST",
      topics: "Product discovery, гипотезы, интервью", description: "Свяжите цели, потребности пользователей и эксперименты с помощью дерева возможностей.", firstStep: "Нарисуйте дерево с одной целью, двумя потребностями и способом проверить решение.", url: "https://www.producttalk.org/opportunity-solution-trees/" },
    { id: "coddy", title: "Практика программирования", provider: "Coddy", category: "code", format: "practice", level: "next", free: true, lang: "EN", mark: "</>", keywords: "питон",
      topics: "Python, Java, JavaScript, C++", description: "Выберите язык и закрепляйте знания короткими упражнениями в браузере.", firstStep: "Выберите знакомый язык и решите задачу с условием или циклом.", url: "https://coddy.tech/" },
    { id: "geekbrains", title: "Старт в IT", provider: "GeekBrains", category: "code", format: "program", level: "start", free: false, lang: "RU", mark: "Dev",
      topics: "Программирование, профессия, карьера", description: "Посмотрите программы школы для старта в разработке и перехода в IT.", firstStep: "Сравните первые модули двух программ и выпишите, на каких задачах сосредоточена каждая.", url: "https://geekbrains.kz/" }
  ];

  window.LEARNING_PATHS = { directions, formats, levels, courses };
})();
