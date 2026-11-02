const lessons = [
  {
    id: 1,
    title: "Знакомство с Python",
    duration: "5 мин",
    lead: "Python — язык программирования, который легко читать и приятно использовать. На нём создают сайты, приложения, игры и даже обучают искусственный интеллект.",
    section: "Твоя первая команда",
    explanation: "Чтобы попросить компьютер вывести текст на экран, используют команду print(). Текст нужно поместить в кавычки.",
    code: 'print("Привет, мир!")',
    output: "Привет, мир!",
    questions: [
      { question: "Как вывести текст на экран?", options: ["show(\"Привет\")", "print(\"Привет\")", "text(\"Привет\")"], answer: 1 },
      { question: "Как правильно записать текстовую строку?", options: ["Привет, мир!", "\"Привет, мир!\"", "(Привет, мир!)"], answer: 1 },
      { question: "Что появится после print(2 + 3)?", options: ["23", "5", "2 + 3"], answer: 1 },
      { question: "Для чего нужна команда print()?", options: ["Чтобы показать результат", "Чтобы создать файл", "Чтобы остановить программу"], answer: 0 },
      { question: "Где записывают текст в print(\"Привет\")?", options: ["В кавычках", "В квадратных скобках", "После точки"], answer: 0 },
      { question: "Что выведет print(\"Python\")?", options: ["Python", "print", "Ничего"], answer: 0 },
      { question: "Как вызвать команду вывода?", options: ["print", "print()", "print[]"], answer: 1 },
      { question: "Что выведет print(\"A\", \"B\")?", options: ["A B", "AB", "Ошибка всегда"], answer: 0 },
      { question: "Какой вариант выводит число 7?", options: ["print(7)", "show(7)", "output[7]"], answer: 0 },
      { question: "Какую команду использовали в первом примере?", options: ["input()", "print()", "range()"], answer: 1 }
    ]
  },
  {
    id: 2,
    title: "Переменные",
    duration: "7 мин",
    lead: "Переменная — это имя, под которым программа хранит значение. Представь подписанную коробку: положи туда данные и используй их позже.",
    section: "Сохраняем данные",
    explanation: "Знак равенства присваивает значение переменной. Имя переменной можно придумать самостоятельно — например, name или age.",
    code: 'name = "Аня"\nprint(name)',
    output: "Аня",
    questions: [
      { question: "Как присвоить переменной age значение 12?", options: ["age == 12", "age = 12", "12 = age"], answer: 1 },
      { question: "Что выведет name = \"Аня\"; print(name)?", options: ["name", "Аня", "Ошибка"], answer: 1 },
      { question: "Как называется age в записи age = 10?", options: ["Переменная", "Оператор вывода", "Цикл"], answer: 0 },
      { question: "Какое значение хранит count после count = 3?", options: ["count", "3", "Ничего"], answer: 1 },
      { question: "Как вывести значение переменной color?", options: ["print(color)", "print(\"color\")", "show[color]"], answer: 0 },
      { question: "Какое имя переменной записано правильно?", options: ["user_name", "user-name", "2user"], answer: 0 },
      { question: "Что делает знак = в записи score = 10?", options: ["Сравнивает два значения", "Присваивает значение", "Печатает текст"], answer: 1 },
      { question: "Что выведет x = 4; print(x + 1)?", options: ["x + 1", "5", "41"], answer: 1 },
      { question: "Как сохранить слово \"кот\" в переменную pet?", options: ["pet = \"кот\"", "\"кот\" = pet", "pet == кот"], answer: 0 },
      { question: "Можно ли изменить значение переменной позже?", options: ["Да, присвоив новое значение", "Нет, никогда", "Только через print()"], answer: 0 }
    ]
  },
  {
    id: 3,
    title: "Числа и действия",
    duration: "7 мин",
    lead: "Python умеет выполнять математические операции. Складывай, вычитай, умножай и дели числа прямо в коде.",
    section: "Считаем с Python",
    explanation: "Для умножения используют звёздочку *, а для деления — косую черту /. Можно сохранить результат в переменную.",
    code: "apples = 3\nfriends = 2\nprint(apples * friends)",
    output: "6",
    questions: [
      { question: "Какой знак используют для умножения в Python?", options: ["×", "*", "x"], answer: 1 },
      { question: "Сколько будет 4 + 3?", options: ["7", "43", "1"], answer: 0 },
      { question: "Какой знак означает вычитание?", options: ["+", "-", "/"], answer: 1 },
      { question: "Сколько будет 3 * 2?", options: ["5", "6", "32"], answer: 1 },
      { question: "Какой оператор используют для деления?", options: ["/", ":", "\\"], answer: 0 },
      { question: "Что выведет print(10 - 4)?", options: ["6", "14", "104"], answer: 0 },
      { question: "Какой оператор находит остаток от деления?", options: ["%", "&", "$"], answer: 0 },
      { question: "Чему равно 8 / 2?", options: ["4", "82", "6"], answer: 0 },
      { question: "Что выведет print(2 + 3 * 2)?", options: ["10", "8", "12"], answer: 1 },
      { question: "Где можно сохранить результат вычисления?", options: ["В переменной", "Только в print", "В комментарии"], answer: 0 }
    ]
  },
  {
    id: 4,
    title: "Текст и строки",
    duration: "7 мин",
    lead: "Текст в Python называется строкой. Строки можно хранить в переменных и соединять между собой.",
    section: "Соединяем строки",
    explanation: "Оператор + соединяет строки. Не забудь добавить пробел, если он нужен между словами.",
    code: 'first = "Привет, "\nname = "мир!"\nprint(first + name)',
    output: "Привет, мир!",
    questions: [
      { question: "Как соединить две строки?", options: ["first + second", "first * second", "first / second"], answer: 0 },
      { question: "Как обозначают строку в Python?", options: ["Кавычками", "Фигурными скобками", "Знаком #"], answer: 0 },
      { question: "Что получится из \"добро\" + \"та\"?", options: ["доброта", "добро та", "Ошибка всегда"], answer: 0 },
      { question: "Как вывести строку \"Привет\"?", options: ["print(\"Привет\")", "print(Привет)", "text(\"Привет\")"], answer: 0 },
      { question: "Какой символ помогает соединить строки?", options: ["+", "*", "/"], answer: 0 },
      { question: "Как добавить пробел между словами при соединении?", options: ["Включить пробел в одну из строк", "Поставить точку", "Использовать /"], answer: 0 },
      { question: "Что хранит переменная greeting = \"Привет\"?", options: ["Строку", "Цикл", "Список чисел"], answer: 0 },
      { question: "Какой вариант задаёт строку из одного слова?", options: ["\"Python\"", "[Python]", "{Python}"], answer: 0 },
      { question: "Что выведет print(\"Py\" + \"thon\")?", options: ["Python", "Py thon", "Py+thon"], answer: 0 },
      { question: "Как вывести содержимое переменной word?", options: ["print(word)", "print(\"word\")", "show[word]"], answer: 0 }
    ]
  },
  {
    id: 5,
    title: "Условия",
    duration: "8 мин",
    lead: "Программы могут принимать решения. Условие if проверяет утверждение и выполняет код, если оно верно.",
    section: "Принимаем решения",
    explanation: "После условия ставят двоеточие, а следующую строку обязательно пишут с отступом.",
    code: 'temperature = 25\nif temperature > 20:\n    print("Тепло!")',
    output: "Тепло!",
    questions: [
      { question: "Что проверяет команда if?", options: ["Условие", "Только текст", "Имя файла"], answer: 0 },
      { question: "Какой знак ставят после условия if?", options: [":", ";", ","], answer: 0 },
      { question: "Что означает сравнение age > 18?", options: ["age больше 18", "age равно 18", "age меньше 18"], answer: 0 },
      { question: "Как записать альтернативную ветку условия?", options: ["else:", "otherwise:", "then:"], answer: 0 },
      { question: "Что делает if score == 10?", options: ["Проверяет равенство score числу 10", "Присваивает score значение 10", "Печатает 10"], answer: 0 },
      { question: "Какой отступ нужен для кода внутри if?", options: ["Отступ в начале строки", "Никакой", "Дефис"], answer: 0 },
      { question: "Что выведет if 5 > 3: print(\"Да\")?", options: ["Да", "Нет", "5"], answer: 0 },
      { question: "Какой оператор означает «не равно»?", options: ["!=", "==", ">="], answer: 0 },
      { question: "Как проверить, что x меньше или равен 4?", options: ["x <= 4", "x =< 4", "x <> 4"], answer: 0 },
      { question: "Когда выполняется блок else?", options: ["Когда условие if ложно", "Всегда до if", "Только при ошибке"], answer: 0 }
    ]
  },
  {
    id: 6,
    title: "Повторяем действия",
    duration: "8 мин",
    lead: "Цикл помогает повторить действие несколько раз и не писать одинаковый код снова и снова.",
    section: "Цикл for",
    explanation: "Команда range(3) создаёт последовательность из трёх чисел: 0, 1 и 2.",
    code: 'for number in range(3):\n    print(number)',
    output: "0\\n1\\n2",
    questions: [
      { question: "Сколько раз выполнится цикл range(3)?", options: ["2 раза", "3 раза", "4 раза"], answer: 1 },
      { question: "Какое первое число выдаёт range(3)?", options: ["0", "1", "3"], answer: 0 },
      { question: "Как начинается цикл for?", options: ["for item in ...:", "repeat item:", "loop(item):"], answer: 0 },
      { question: "Что нужно поставить в конце строки for?", options: [":", ";", "."], answer: 0 },
      { question: "Что выведет for n in range(2): print(n)?", options: ["0 и 1", "1 и 2", "0, 1 и 2"], answer: 0 },
      { question: "Зачем используют цикл?", options: ["Повторять действия", "Переименовывать файлы", "Создавать строки"], answer: 0 },
      { question: "Сколько чисел содержит range(5)?", options: ["5", "4", "6"], answer: 0 },
      { question: "Какой отступ нужен для тела цикла?", options: ["Отступ в начале строки", "Двоеточие перед кодом", "Кавычки"], answer: 0 },
      { question: "Что выведет print(n) в цикле?", options: ["Текущее значение n", "Всегда ноль", "Имя цикла"], answer: 0 },
      { question: "Как повторить команду три раза?", options: ["for n in range(3):", "if n == 3:", "print * 3"], answer: 0 }
    ]
  },
  {
    id: 7,
    title: "Списки",
    duration: "8 мин",
    lead: "Список хранит несколько значений в одном месте. Например, можно собрать список любимых фруктов.",
    section: "Создаём список",
    explanation: "Элементы списка записывают в квадратных скобках через запятую. Нумерация начинается с нуля.",
    code: 'fruits = ["яблоко", "груша"]\nprint(fruits[0])',
    output: "яблоко",
    questions: [
      { question: "С какого номера начинается список в Python?", options: ["С нуля", "С единицы", "С минус единицы"], answer: 0 },
      { question: "В каких скобках записывают список?", options: ["Квадратных []", "Круглых ()", "Фигурных {}"], answer: 0 },
      { question: "Как записать список из 1 и 2?", options: ["[1, 2]", "(1, 2)", "\"1, 2\""], answer: 0 },
      { question: "Как получить первый элемент fruits?", options: ["fruits[0]", "fruits[1]", "fruits.first"], answer: 0 },
      { question: "Как добавить элемент в конец списка items?", options: ["items.append(value)", "items.addLast(value)", "append.items(value)"], answer: 0 },
      { question: "Как узнать количество элементов списка items?", options: ["len(items)", "items.size()", "count(items)"], answer: 0 },
      { question: "Сколько элементов в [\"a\", \"b\"]?", options: ["2", "1", "3"], answer: 0 },
      { question: "Как заменить первый элемент списка?", options: ["items[0] = value", "items(0) = value", "items.first = value"], answer: 0 },
      { question: "Что вернёт [\"яблоко\", \"груша\"][1]?", options: ["груша", "яблоко", "Ошибка"], answer: 0 },
      { question: "Можно ли хранить в списке текст и числа?", options: ["Да", "Нет", "Только текст"], answer: 0 }
    ]
  },
  {
    id: 8,
    title: "Твоя мини-программа",
    duration: "10 мин",
    lead: "Ты уже познакомился с основами Python. Давай соберём их в небольшую программу и отпразднуем первый результат!",
    section: "Собираем вместе",
    explanation: "Здесь программа использует переменную и команду print(), чтобы поприветствовать пользователя.",
    code: 'name = "разработчик"\nprint("Привет, " + name + "!")',
    output: "Привет, разработчик!",
    questions: [
      { question: "Как называется команда для вывода текста?", options: ["print()", "input()", "if"], answer: 0 },
      { question: "Как сохранить имя в переменную?", options: ["name = \"Ли\"", "\"Ли\" == name", "name: \"Ли\""], answer: 0 },
      { question: "Как получить ввод пользователя?", options: ["input()", "print()", "range()"], answer: 0 },
      { question: "Как соединить две строки?", options: ["Оператор +", "Оператор /", "Оператор >"], answer: 0 },
      { question: "Какой оператор проверяет равенство?", options: ["==", "=", "!="], answer: 0 },
      { question: "Для чего нужен цикл for?", options: ["Повторять команды", "Сравнивать строки", "Выводить ошибку"], answer: 0 },
      { question: "Как создать список чисел?", options: ["[1, 2, 3]", "(1, 2, 3)", "\"1, 2, 3\""], answer: 0 },
      { question: "Что нужно написать после if-условия?", options: [":", ";", "запятую"], answer: 0 },
      { question: "Какой отступ показывает блок кода?", options: ["Пробелы в начале строки", "Кавычки", "Скобки вокруг строки"], answer: 0 },
      { question: "Что можно сделать с Python после этих уроков?", options: ["Написать небольшую программу", "Только открыть текстовый файл", "Ничего без другого языка"], answer: 0 }
    ]
  }

];

lessons.push(...window.PYTHON_LEVELS.flatMap(level => level.lessons.map(lesson => ({
  ...lesson.localizations.ru,
  id: lesson.id,
  level: lesson.level,
  duration: lesson.localizations.ru.duration,
  code: lesson.code,
  output: lesson.output,
  questions: lesson.localizations.ru.questions,
  localizations: lesson.localizations
}))));
lessons.slice(0, 8).forEach(lesson => { lesson.level = "beginner"; });
window.PYTHON_LEVELS[0].lessons.unshift(...lessons.slice(0, 8));

const storageKey = "kod-python-progress-v1";
const streakStorageKey = "kod-python-streak-v1";
const consentKey = "kod-analytics-consent-v1";
const languageKey = "kod-app-language-v1";
const screens = ["home", "course", "progress", "settings", "lesson"];
let progress = loadProgress();
let learningStreak = loadLearningStreak();
let activeLesson = null;
let selectedLevel = "beginner";
let toastTimeout;
let installPrompt = null;
let analyticsReady = false;
let currentLanguage = loadLanguage();
let currentTheme = loadTheme();
let pythonWorker = null;
let pythonRunId = 0;
let pythonRunTimeout;
let pythonRuntimeReady = false;

function loadLanguage() {
  try {
    const saved = localStorage.getItem(languageKey);
    return saved === "en" ? saved : "ru";
  } catch (error) {
    console.error("Не удалось загрузить язык приложения:", error);
    return "ru";
  }
}

function loadTheme() {
  try {
    return localStorage.getItem("kod-app-theme-v1") === "dark" ? "dark" : "light";
  } catch (error) {
    console.error("Не удалось загрузить тему приложения:", error);
    return "light";
  }
}

function translate(key, values = {}) {
  const russian = {
    lessonsProgress: "{count} из {total} уроков",
    streakLabel: "Серия занятий",
    streakDayOne: "день",
    streakDayFew: "дня подряд",
    streakDayMany: "дней подряд",
    lessonPassedStatus: "Урок пройден",
    nextLessonStatus: "Следующий урок",
    courseLessonStatus: "Урок курса",
    lessonUnit: "УРОК {number} · {duration}",
    attemptsEnded: "Попытки закончились",
    correctAnswer: "Правильный ответ: {answer}. Урок пока не пройден.",
    retryQuiz: "Начать тест заново",
    tryAgain: "Попробовать тест ещё раз",
    levelUnlockHint: "Заверши предыдущий уровень, чтобы открыть этот.",
    allQuestionsPassed: "Все {total} вопросов пройдены!",
    testPassed: "Отличная работа — тест пройден 🎉",
    questionOf: "ВОПРОС {current} ИЗ {total}",
    attemptsRemaining: "Вопрос {current} из {total} · попыток осталось: {remaining} из 3",
    wrongTryAgain: "Неверно. Попробуй ещё раз.",
    lessonCodeIntro: "Попробуй повторить этот пример или придумать свой. Ошибки — нормальная часть обучения!",
    lessonPassed: "Урок пройден ✓",
    finishLesson: "Завершить урок ✓",
    lessonNotPassed: "Завершить урок",
    startTestFirst: "Сначала пройди тест",
    lessonFailedToast: "Урок не засчитан. В следующий раз начни сначала.",
    courseCompletedToast: "Курс завершён! Ты отлично справился 🎉",
    lessonCompletedToast: "Урок завершён! Так держать 🎉",
    saveProgressError: "Не удалось сохранить прогресс на этом устройстве.",
    saveSettingsError: "Не удалось сохранить настройки.",
    analyticsReadError: "Не удалось прочитать согласие на аналитику:",
    analyticsSaveError: "Не удалось сохранить настройки аналитики:",
    analyticsLoadError: "Не удалось загрузить скрипт Яндекс Метрики.",
    offlineError: "Не удалось зарегистрировать офлайн-режим:",
    installLabel: "Установить приложение",
    settingsLabel: "Настройки",
    languageLabel: "Язык приложения",
    themeLabel: "Тема оформления",
    themeDescription: "Выбери светлую или тёмную тему.",
    lightTheme: "Светлая",
    darkTheme: "Тёмная",
    lessonListLabel: "Уроки курса",
    profileLabel: "Ваш профиль",
    homeLabel: "Код — на главную",
    playgroundTitle: "Попробуй сам",
    playgroundDescription: "Измени код и запусти его, чтобы увидеть результат.",
    playgroundFirstRunNote: "Python загружается при первом запуске кода. Для этого понадобится интернет.",
    runCode: "Запустить код",
    runningCode: "Запускаем Python...",
    loadingPython: "Загружается Python...",
    codeRunning: "Выполняется...",
    codeReady: "Готов к запуску.",
    emptyCode: "Сначала напиши код на Python.",
    pythonOutput: "Результат",
    noOutput: "Программа завершилась, ничего не выведя на экран.",
    pythonError: "Ошибка Python:",
    pythonTimeout: "Код выполнялся слишком долго. Мы остановили его, чтобы приложение продолжило работать.",
    pythonLoadingTimeout: "Не удалось загрузить Python за 2 минуты. Проверь интернет и доступ к cdn.jsdelivr.net, затем перезагрузи страницу.",
    pythonWorkerError: "Не удалось запустить Python. Проверь подключение и попробуй ещё раз.",
    lessonLocked: "Сначала пройди предыдущие уроки.",
    levelProgress: "{count} из 30 уроков",
    levelUnlocked: "Доступен",
    levelLocked: "Закрыт"
  };
  const template = currentLanguage === "en"
    ? window.APP_TRANSLATIONS?.en?.ui?.[key]
    : russian[key];
  if (!template) return key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}

function getLocalizedLesson(lesson) {
  if (lesson.localizations) return { ...lesson, ...lesson.localizations[currentLanguage] };
  if (currentLanguage !== "en") return lesson;
  const translated = window.APP_TRANSLATIONS.en.lessons[lesson.id - 1];
  return {
    ...lesson,
    ...translated,
    duration: lesson.duration.replace("мин", "min"),
    questions: translated.questions.map(([question, options], index) => ({
      question,
      options,
      answer: lesson.questions[index].answer
    }))
  };
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    if (element.dataset.defaultHtml === undefined) element.dataset.defaultHtml = element.innerHTML;
    const value = currentLanguage === "en"
      ? window.APP_TRANSLATIONS.en.ui[element.dataset.i18n]
      : element.dataset.defaultHtml;
    if (value === undefined) return;
    if (element.dataset.i18n === "welcome" || currentLanguage === "ru") element.innerHTML = value;
    else element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
    if (element.dataset.defaultAriaLabel === undefined) element.dataset.defaultAriaLabel = element.getAttribute("aria-label") || "";
    const value = currentLanguage === "en"
      ? window.APP_TRANSLATIONS.en.ui[element.dataset.i18nAriaLabel]
      : element.dataset.defaultAriaLabel;
    if (value !== undefined) element.setAttribute("aria-label", value);
  });
  document.getElementById("install-button").setAttribute("aria-label", translate("installLabel"));
  document.getElementById("settings-button").setAttribute("aria-label", translate("settingsLabel"));
  document.getElementById("settings-button").title = translate("settingsLabel");
  document.getElementById("language-select").value = currentLanguage;
  document.getElementById("theme-select").value = currentTheme;
  document.title = currentLanguage === "en" ? "Code — learn to program" : "Код — учись программировать";
  updateProgress();
  renderLevelPicker();
  renderLessonList();
  if (activeLesson && !document.getElementById("lesson-screen").hidden) openLesson(activeLesson.id);
}

function setTheme(theme) {
  if (!["light", "dark"].includes(theme)) return;
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem("kod-app-theme-v1", theme);
  } catch (error) {
    console.error("Не удалось сохранить тему приложения:", error);
    showToast(translate("saveSettingsError"));
  }
}

function setLanguage(language) {
  if (!["ru", "en"].includes(language)) return;
  currentLanguage = language;
  try {
    localStorage.setItem(languageKey, language);
  } catch (error) {
    console.error("Не удалось сохранить язык приложения:", error);
    showToast(translate("saveSettingsError"));
  }
  applyLanguage();
}

function isLevelUnlocked(levelIndex) {
  return levelIndex === 0 || window.PYTHON_LEVELS[levelIndex - 1].lessons
    .every(lesson => progress.completed.includes(lesson.id));
}

function renderLevelPicker() {
  const picker = document.getElementById("level-picker");
  const level = window.PYTHON_LEVELS.find(item => item.id === selectedLevel) || window.PYTHON_LEVELS[0];
  const levelIndex = window.PYTHON_LEVELS.indexOf(level);
  if (!isLevelUnlocked(levelIndex)) selectedLevel = window.PYTHON_LEVELS[Math.max(0, levelIndex - 1)].id;
  const currentLevel = window.PYTHON_LEVELS.find(item => item.id === selectedLevel);
  picker.innerHTML = window.PYTHON_LEVELS.map((item, index) => {
    const unlocked = isLevelUnlocked(index);
    const active = item.id === selectedLevel;
    const title = item.title[currentLanguage];
    return `<button class="level-tab ${active ? "active" : ""}" type="button" data-level="${item.id}" aria-pressed="${active}" ${unlocked ? "" : "disabled"} ${unlocked ? "" : `title="${translate("levelUnlockHint")}"`} aria-label="${escapeHtml(title)} — ${translate(unlocked ? "levelUnlocked" : "levelLocked")}">${escapeHtml(title)}<small>${translate(unlocked ? "levelUnlocked" : "levelLocked")}</small></button>`;
  }).join("");
  const currentLessons = currentLevel.lessons;
  const completedCount = currentLessons.filter(lesson => progress.completed.includes(lesson.id)).length;
  document.getElementById("level-title").textContent = currentLevel.title[currentLanguage];
  document.getElementById("level-description").textContent = currentLevel.description[currentLanguage];
  document.getElementById("level-count").textContent = translate("levelProgress", { count: completedCount });
  picker.setAttribute("aria-label", currentLanguage === "en" ? "Python course levels" : "Уровни Python");
}

function isLessonUnlocked(lesson) {
  const levelIndex = window.PYTHON_LEVELS.findIndex(level => level.id === lesson.level);
  if (levelIndex < 0 || !isLevelUnlocked(levelIndex)) return false;
  const currentLevel = window.PYTHON_LEVELS[levelIndex];
  const lessonIndex = currentLevel.lessons.findIndex(item => item.id === lesson.id);
  return currentLevel.lessons.slice(0, lessonIndex).every(item => progress.completed.includes(item.id));
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const completed = Array.isArray(saved.completed)
      ? saved.completed.filter(id => lessons.some(lesson => lesson.id === id))
      : [];
    const quiz = {};
    if (saved.quiz && typeof saved.quiz === "object" && !Array.isArray(saved.quiz)) {
      lessons.forEach(lesson => {
        const result = saved.quiz[lesson.id];
        if (!result || typeof result !== "object" || !Number.isInteger(result.questionIndex)) return;
        quiz[lesson.id] = {
          questionIndex: Math.max(0, Math.min(lesson.questions.length, result.questionIndex)),
          attempts: Number.isInteger(result.attempts) ? Math.max(0, Math.min(3, result.attempts)) : 0,
          failed: result.failed === true,
          passed: result.passed === true,
          lastAnswerWrong: result.lastAnswerWrong === true
        };
      });
    }
    return { completed: [...new Set(completed)], quiz };
  } catch (error) {
    console.error("Не удалось загрузить прогресс обучения:", error);
    return { completed: [], quiz: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch (error) {
    console.error("Не удалось сохранить прогресс обучения:", error);
    showToast(translate("saveProgressError"));
  }
}

function loadLearningStreak() {
  try {
    const saved = JSON.parse(localStorage.getItem(streakStorageKey) || "{}");
    const lastStudyDate = typeof saved.lastStudyDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(saved.lastStudyDate)
      ? saved.lastStudyDate
      : "";
    return {
      days: Number.isInteger(saved.days) ? Math.max(0, saved.days) : 0,
      lastStudyDate
    };
  } catch (error) {
    console.error("Не удалось загрузить серию занятий:", error);
    return { days: 0, lastStudyDate: "" };
  }
}

function saveLearningStreak() {
  try {
    localStorage.setItem(streakStorageKey, JSON.stringify(learningStreak));
  } catch (error) {
    console.error("Не удалось сохранить серию занятий:", error);
    showToast(translate("saveProgressError"));
  }
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPreviousDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "";
  date.setDate(date.getDate() - 1);
  return getLocalDateKey(date);
}

function getCurrentStreak() {
  const today = getLocalDateKey();
  if (learningStreak.lastStudyDate === today || learningStreak.lastStudyDate === getPreviousDateKey(today)) {
    return learningStreak.days;
  }
  return 0;
}

function recordStudyDay() {
  const today = getLocalDateKey();
  if (learningStreak.lastStudyDate === today) return;
  const days = learningStreak.lastStudyDate === getPreviousDateKey(today)
    ? learningStreak.days + 1
    : 1;
  learningStreak = { days, lastStudyDate: today };
  saveLearningStreak();
}

function getStreakUnit(days) {
  if (currentLanguage === "en") return translate(days === 1 ? "streakDay" : "streakDays");
  const category = new Intl.PluralRules("ru-RU").select(days);
  if (category === "one") return translate("streakDayOne");
  if (category === "few") return translate("streakDayFew");
  return translate("streakDayMany");
}

function navigate(screen) {
  if (!screens.includes(screen)) return;
  screens.forEach(name => {
    const element = document.getElementById(`${name}-screen`);
    element.hidden = name !== screen;
    element.classList.toggle("active", name === screen);
  });
  document.querySelectorAll(".nav-item").forEach(button => {
    const active = button.dataset.nav === screen;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (screen === "course") renderLessonList();
  if (screen === "progress") updateProgress();
  if (screen !== "lesson" && analyticsReady) {
    window.ym(window.APP_CONFIG.yandexMetrikaId, "hit", window.location.href, { title: document.title });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function updateProgress() {
  const count = progress.completed.length;
  const total = lessons.length;
  const percent = Math.round((count / total) * 100);
  document.getElementById("progress-label").textContent = translate("lessonsProgress", { count, total });
  document.getElementById("progress-bar").style.width = `${percent}%`;
  const progressTrack = document.querySelector(".progress-track");
  progressTrack.setAttribute("aria-valuemax", String(total));
  progressTrack.setAttribute("aria-valuenow", String(count));
  document.getElementById("progress-percent").textContent = `${percent}%`;
  document.getElementById("progress-detail").textContent = translate("lessonsProgress", { count, total });
  document.getElementById("completed-stat").textContent = String(count);
  document.getElementById("progress-ring").style.setProperty("--progress", `${percent}%`);
  const streak = getCurrentStreak();
  const streakUnit = getStreakUnit(streak);
  document.getElementById("streak-count").textContent = String(streak);
  document.getElementById("streak-unit").textContent = streakUnit;
  document.querySelector(".streak").setAttribute("aria-label", `${translate("streakLabel")}: ${streak} ${streakUnit}`);
  document.getElementById("streak-stat").textContent = `${streak} ${streakUnit}`;
  const nextLessonId = lessons.find(lesson => !progress.completed.includes(lesson.id))?.id || lessons[lessons.length - 1].id;
  document.querySelectorAll("#home-screen [data-open-lesson]").forEach(button => { button.dataset.openLesson = String(nextLessonId); });
}

function renderLessonList() {
  const list = document.getElementById("lesson-list");
  const level = window.PYTHON_LEVELS.find(item => item.id === selectedLevel);
  const currentLessons = level.lessons;
  const nextId = currentLessons.find(lesson => !progress.completed.includes(lesson.id))?.id;
  list.innerHTML = currentLessons.map(lesson => {
    const displayLesson = getLocalizedLesson(lesson);
    const done = progress.completed.includes(lesson.id);
    const current = lesson.id === nextId;
    const unlocked = isLessonUnlocked(lesson);
    const status = done ? translate("lessonPassedStatus") : !unlocked ? translate("lessonLocked") : current ? translate("nextLessonStatus") : translate("courseLessonStatus");
    return `<button class="lesson-item ${done ? "done" : ""} ${current ? "current" : ""} ${unlocked ? "" : "locked"}" type="button" data-open-lesson="${lesson.id}" ${unlocked ? "" : "aria-disabled=\"true\""} aria-label="${translate("lessonUnit", { number: lesson.id, duration: displayLesson.duration })}: ${displayLesson.title}, ${status}">
      <span class="lesson-marker" aria-hidden="true">${done ? "✓" : lesson.id}</span>
      <span class="lesson-number">${String(lesson.id).padStart(2, "0")}</span>
      <span class="lesson-text"><strong>${displayLesson.title}</strong><small>${status}</small></span>
      <span class="lesson-duration">${unlocked ? displayLesson.duration : "🔒"}</span>
    </button>`;
  }).join("");
}

function getQuestionChoices(lesson, questionIndex) {
  const question = lesson.questions[questionIndex];
  const offset = (lesson.id + questionIndex) % question.options.length;
  return question.options.map((_, index) => {
    const originalIndex = (index + offset) % question.options.length;
    return { text: question.options[originalIndex], correct: originalIndex === question.answer };
  });
}

function openLesson(id) {
  const sourceLesson = lessons.find(item => item.id === Number(id));
  if (!sourceLesson) return;
  if (!isLessonUnlocked(sourceLesson)) {
    showToast(translate("lessonLocked"));
    return;
  }
  activeLesson = sourceLesson;
  const lesson = getLocalizedLesson(sourceLesson);
  const quizResult = progress.quiz[lesson.id] || {
    questionIndex: 0, attempts: 0, failed: false, passed: false, lastAnswerWrong: false
  };
  const wasCompleted = progress.completed.includes(lesson.id);
  if (wasCompleted && !quizResult.passed) {
    progress.completed = progress.completed.filter(completedId => completedId !== lesson.id);
    saveProgress();
  }
  const isDone = progress.completed.includes(lesson.id) && quizResult.passed;
  const currentQuestion = lesson.questions[quizResult.questionIndex];
  const attemptsLeft = Math.max(0, 3 - quizResult.attempts);
  const questionChoices = currentQuestion ? getQuestionChoices(lesson, quizResult.questionIndex) : [];
  let quizContent;
  if (quizResult.failed && currentQuestion) {
    quizContent = `    <p id="attempts-remaining">${translate("attemptsEnded")}</p>
      <div class="quiz-options">${questionChoices.map(choice => `<button class="quiz-option ${choice.correct ? "correct" : ""}" type="button" disabled>${escapeHtml(choice.text)}</button>`).join("")}</div>
    <p class="quiz-feedback" id="quiz-feedback" aria-live="polite">${translate("correctAnswer", { answer: escapeHtml(questionChoices.find(choice => choice.correct).text) })}</p>
    <button class="secondary-button retry-quiz" id="retry-quiz" type="button">${translate("retryQuiz")}</button>`;
  } else if (quizResult.passed) {
    quizContent = `<p id="attempts-remaining">${translate("allQuestionsPassed", { total: lesson.questions.length })}</p>
    <p class="quiz-feedback" id="quiz-feedback" aria-live="polite">${translate("testPassed")}</p>`;
  } else if (currentQuestion) {
    quizContent = `<p id="attempts-remaining">${translate("attemptsRemaining", { current: quizResult.questionIndex + 1, total: lesson.questions.length, remaining: attemptsLeft })}</p>
      <div class="quiz-options">${questionChoices.map((choice, index) => `<button class="quiz-option" type="button" data-answer="${index}">${escapeHtml(choice.text)}</button>`).join("")}</div>
    <p class="quiz-feedback" id="quiz-feedback" aria-live="polite">${quizResult.lastAnswerWrong ? translate("wrongTryAgain") : ""}</p>`;
  }
  const content = document.getElementById("lesson-content");
  content.innerHTML = `<p class="lesson-kicker">${translate("lessonUnit", { number: String(lesson.id).padStart(2, "0"), duration: lesson.duration.toUpperCase() })}</p>
    <h1 id="lesson-title">${lesson.title}</h1>
    <p class="lesson-lead">${lesson.lead}</p>
    <article class="lesson-body">
      <h2>${lesson.section}</h2>
      <p>${lesson.explanation}</p>
      <div class="code-block"><span class="code-label">Python</span><code>${escapeHtml(lesson.code)}</code></div>
      <div class="code-output"><strong>${currentLanguage === "en" ? window.APP_TRANSLATIONS.en.ui.resultLabel : "Результат:"}</strong> ${escapeHtml(lesson.output).replaceAll("\n", "<br>")}</div>
      <p>${translate("lessonCodeIntro")}</p>
    </article>
    <section class="playground-card" aria-labelledby="playground-title">
      <p class="eyebrow">PYTHON</p>
      <h2 id="playground-title">${translate("playgroundTitle")}</h2>
      <p class="muted">${translate("playgroundDescription")}</p>
      <label class="editor-label" for="python-editor">${translate("playgroundTitle")}</label>
      <textarea class="python-editor" id="python-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="${translate("playgroundTitle")}">${escapeHtml(lesson.code.replace(/\\n/g, "\n"))}</textarea>
      <div class="editor-actions">
        <button class="primary-button run-code-button" id="run-python" type="button"><span aria-hidden="true">▶</span> ${translate("runCode")}</button>
        <span class="editor-status" id="python-status" role="status" aria-live="polite">${translate("codeReady")}</span>
      </div>
      <p class="editor-note">${translate("playgroundFirstRunNote")}</p>
      <div class="output-panel" aria-live="polite"><strong>${translate("pythonOutput")}</strong><pre id="python-output">${translate("codeReady")}</pre></div>
    </section>
    <section class="quiz-card" aria-labelledby="quiz-title">
      <p class="eyebrow">${translate("questionOf", { current: Math.min(quizResult.questionIndex + 1, lesson.questions.length), total: lesson.questions.length })}</p>
      <h2 id="quiz-title">${quizResult.failed ? translate("tryAgain") : quizResult.passed ? translate("testPassed") : currentQuestion?.question || ""}</h2>
      ${quizContent}
    </section>
    <button class="primary-button lesson-complete" id="complete-lesson" type="button" ${isDone || (!quizResult.passed && !quizResult.failed) ? "disabled" : ""}>${isDone ? translate("lessonPassed") : quizResult.passed ? translate("finishLesson") : quizResult.failed ? translate("lessonNotPassed") : translate("startTestFirst")}</button>`;
  navigate("lesson");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function initializeAnalytics() {
  const counterId = window.APP_CONFIG?.yandexMetrikaId;
  if (!/^\d+$/.test(String(counterId || ""))) return;

  let consent;
  try {
    consent = localStorage.getItem(consentKey);
  } catch (error) {
    console.error("Не удалось прочитать согласие на аналитику:", error);
    return;
  }

  if (consent === "accepted") {
    loadAnalytics(counterId);
  } else if (consent !== "rejected") {
    document.getElementById("consent-banner").hidden = false;
  }
}

function saveAnalyticsConsent(value) {
  try {
    localStorage.setItem(consentKey, value);
  } catch (error) {
    console.error("Не удалось сохранить выбор настроек аналитики:", error);
    showToast("Не удалось сохранить настройки аналитики.");
    return;
  }
  document.getElementById("consent-banner").hidden = true;
  if (value === "accepted") loadAnalytics(window.APP_CONFIG.yandexMetrikaId);
}

function loadAnalytics(counterId) {
  if (analyticsReady) return;
  analyticsReady = true;
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = Date.now();
    for (const script of e.scripts) {
      if (script.src === r) return;
    }
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = true;
    k.src = r;
    k.onerror = () => {
      analyticsReady = false;
      console.error("Не удалось загрузить скрипт Яндекс Метрики.");
    };
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false
  });
}

function updateDomainMetadata() {
  const domain = window.APP_CONFIG?.domain?.replace(/\/+$/, "");
  if (!domain || domain.includes("your-domain.example")) return;
  const metadata = {
    canonical: `${domain}/`,
    "og:url": `${domain}/`,
    "og:image": `${domain}/social-preview.png`,
    "twitter:image": `${domain}/social-preview.png`
  };
  Object.entries(metadata).forEach(([key, value]) => {
    const selector = key === "canonical"
      ? 'link[rel="canonical"]'
      : `meta[property="${key}"], meta[name="${key}"]`;
    document.querySelectorAll(selector).forEach(element => {
      element.setAttribute(key === "canonical" ? "href" : "content", value);
    });
  });
}

function finishPythonRun({ output, error }) {
  window.clearTimeout(pythonRunTimeout);
  const button = document.getElementById("run-python");
  const status = document.getElementById("python-status");
  const outputElement = document.getElementById("python-output");
  if (!button || !status || !outputElement) return;

  button.disabled = false;
  button.innerHTML = `<span aria-hidden="true">▶</span> ${translate("runCode")}`;
  if (error) {
    status.textContent = translate("pythonError");
    outputElement.textContent = `${translate("pythonError")}\n${error}`;
    outputElement.classList.add("output-error");
    return;
  }
  status.textContent = translate("codeReady");
  outputElement.textContent = output || translate("noOutput");
  outputElement.classList.remove("output-error");
}

function startPythonRunTimeout(timeout, errorMessage) {
  window.clearTimeout(pythonRunTimeout);
  pythonRunTimeout = window.setTimeout(() => {
    pythonWorker?.terminate();
    pythonWorker = null;
    pythonRuntimeReady = false;
    finishPythonRun({ error: translate(errorMessage) });
  }, timeout);
}

function runPythonCode() {
  const editor = document.getElementById("python-editor");
  const button = document.getElementById("run-python");
  const status = document.getElementById("python-status");
  const output = document.getElementById("python-output");
  if (!editor || !button || !status || !output || button.disabled) return;
  const code = editor.value.trim();
  if (!code) {
    status.textContent = translate("emptyCode");
    output.textContent = translate("emptyCode");
    return;
  }

  button.disabled = true;
  button.innerHTML = `<span aria-hidden="true">⏳</span> ${translate("codeRunning")}`;
  status.textContent = translate("loadingPython");
  output.textContent = translate("loadingPython");
  output.classList.remove("output-error");
  const runId = ++pythonRunId;

  try {
    if (!pythonWorker) {
      pythonWorker = new Worker("./python-worker.js");
      pythonWorker.onmessage = event => {
        if (event.data.id !== pythonRunId) return;
        if (event.data.status === "loading") {
          status.textContent = translate("loadingPython");
          return;
        }
        if (event.data.status === "ready") {
          pythonRuntimeReady = true;
          status.textContent = translate("codeRunning");
          startPythonRunTimeout(20000, "pythonTimeout");
          return;
        }
        finishPythonRun(event.data);
      };
      pythonWorker.onerror = error => {
        console.error("Ошибка среды Python:", error.message);
        pythonWorker?.terminate();
        pythonWorker = null;
        pythonRuntimeReady = false;
        finishPythonRun({ error: translate("pythonWorkerError") });
      };
    }
    startPythonRunTimeout(pythonRuntimeReady ? 20000 : 120000, pythonRuntimeReady ? "pythonTimeout" : "pythonLoadingTimeout");
    pythonWorker.postMessage({ id: runId, code });
  } catch (error) {
    console.error("Не удалось запустить среду Python:", error);
    pythonWorker?.terminate();
    pythonWorker = null;
    pythonRuntimeReady = false;
    finishPythonRun({ error: translate("pythonWorkerError") });
  }
}

document.addEventListener("click", event => {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    navigate(navButton.dataset.nav);
    return;
  }
  if (event.target.closest("#run-python")) {
    runPythonCode();
    return;
  }
  if (event.target.closest("#settings-button")) {
    navigate("settings");
    return;
  }
  const levelButton = event.target.closest("[data-level]");
  if (levelButton) {
    if (levelButton.disabled) {
      showToast(translate("levelLocked"));
      return;
    }
    selectedLevel = levelButton.dataset.level;
    renderLevelPicker();
    renderLessonList();
    return;
  }
  const lessonButton = event.target.closest("[data-open-lesson]");
  if (lessonButton) {
    openLesson(lessonButton.dataset.openLesson);
    return;
  }
  const answerButton = event.target.closest("[data-answer]");
  if (answerButton && activeLesson) {
    const quizResult = progress.quiz[activeLesson.id] || {
      questionIndex: 0, attempts: 0, failed: false, passed: false, lastAnswerWrong: false
    };
    const question = activeLesson.questions[quizResult.questionIndex];
    if (!question || quizResult.failed || quizResult.passed || quizResult.attempts >= 3) return;
    const choices = getQuestionChoices(activeLesson, quizResult.questionIndex);
    const isCorrect = choices[Number(answerButton.dataset.answer)]?.correct === true;
    if (isCorrect) {
      quizResult.questionIndex += 1;
      quizResult.attempts = 0;
      quizResult.lastAnswerWrong = false;
      quizResult.passed = quizResult.questionIndex === activeLesson.questions.length;
    } else {
      quizResult.attempts += 1;
      quizResult.lastAnswerWrong = true;
      quizResult.failed = quizResult.attempts === 3;
    }
    progress.quiz[activeLesson.id] = quizResult;
    if (quizResult.failed) {
      progress.completed = progress.completed.filter(id => id !== activeLesson.id);
    }
    saveProgress();
    openLesson(activeLesson.id);
    return;
  }
  if (event.target.closest("#retry-quiz") && activeLesson) {
    progress.quiz[activeLesson.id] = {
      questionIndex: 0, attempts: 0, failed: false, passed: false, lastAnswerWrong: false
    };
    progress.completed = progress.completed.filter(id => id !== activeLesson.id);
    saveProgress();
    openLesson(activeLesson.id);
    return;
  }
  if (event.target.closest("#complete-lesson") && activeLesson) {
    const quizResult = progress.quiz[activeLesson.id];
    if (quizResult?.failed) {
      progress.quiz[activeLesson.id] = {
        questionIndex: 0, attempts: 0, failed: false, passed: false, lastAnswerWrong: false
      };
      progress.completed = progress.completed.filter(id => id !== activeLesson.id);
      saveProgress();
      navigate("course");
      showToast(translate("lessonFailedToast"));
      return;
    }
    if (progress.quiz[activeLesson.id]?.passed && !progress.completed.includes(activeLesson.id)) {
      progress.completed.push(activeLesson.id);
      recordStudyDay();
      saveProgress();
      updateProgress();
      renderLevelPicker();
      renderLessonList();
      const button = document.getElementById("complete-lesson");
      button.disabled = true;
      button.textContent = translate("lessonPassed");
      showToast(progress.completed.length === lessons.length ? translate("courseCompletedToast") : translate("lessonCompletedToast"));
    }
  }
});

document.getElementById("back-to-course").addEventListener("click", () => navigate("course"));
document.getElementById("language-select").addEventListener("change", event => setLanguage(event.target.value));
document.getElementById("theme-select").addEventListener("change", event => setTheme(event.target.value));
document.addEventListener("keydown", event => {
  if (event.target.id !== "python-editor") return;
  if (event.key === "Tab") {
    event.preventDefault();
    const editor = event.target;
    editor.setRangeText("    ", editor.selectionStart, editor.selectionEnd, "end");
  } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    runPythonCode();
  }
});
document.getElementById("consent-accept").addEventListener("click", () => saveAnalyticsConsent("accepted"));
document.getElementById("consent-reject").addEventListener("click", () => saveAnalyticsConsent("rejected"));

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  document.getElementById("install-button").hidden = false;
});

document.getElementById("install-button").addEventListener("click", async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  installPrompt = null;
  document.getElementById("install-button").hidden = true;
});

updateProgress();
renderLessonList();
setTheme(currentTheme);
applyLanguage();
updateDomainMetadata();
initializeAnalytics();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.error("Не удалось зарегистрировать офлайн-режим:", error);
    });
  });
}
