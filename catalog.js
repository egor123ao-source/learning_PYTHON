(() => {
  "use strict";

  const { directions, formats, levels, courses } = window.LEARNING_PATHS;
  const $ = id => document.getElementById(id);
  const search = $("course-search");
  const levelSelect = $("course-level");
  const formatSelect = $("course-format");
  const languageSelect = $("course-language");
  const freeOnly = $("course-free");
  const grid = $("course-grid");
  const compareIds = new Set();
  const pageSize = 9;
  const compareLimit = 3;
  let direction = "all";
  let shown = pageSize;

  for (const [id, item] of Object.entries(directions)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter";
    button.dataset.filter = id;
    button.textContent = item.name;
    $("direction-filters").append(button);
  }
  for (const [select, options] of [[levelSelect, levels], [formatSelect, formats]]) {
    for (const [id, name] of Object.entries(options)) select.add(new Option(name, id));
  }

  function courseLink(course, text) {
    const link = document.createElement("a");
    const external = course.url.startsWith("https://");
    link.href = course.url;
    link.textContent = text;
    link.setAttribute("aria-label", `${text}: ${course.title}${external ? ", новая вкладка" : ""}`);
    if (external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  }

  function renderCard(course) {
    const item = directions[course.category];
    const card = document.createElement("article");
    card.className = "course-card";
    // These values come from the bundled catalog. Search text never enters card markup.
    card.innerHTML = `
      <div class="course-art tone-${item.tone}">
        <span class="course-symbol" aria-hidden="true"></span>
        <span class="course-category">${item.name}</span>
      </div>
      <div class="course-content">
        <div class="course-provider"><span>${course.provider}</span><span>${course.free ? "Бесплатно" : "Условия у школы"}</span></div>
        <h3 tabindex="-1">${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta"><span>${levels[course.level]}</span><span>${formats[course.format]}</span><span>${course.lang}</span></div>
        <div class="course-bottom"><button type="button" class="compare-option" data-compare="${course.id}">Сравнить</button></div>
      </div>`;
    card.querySelector(".course-symbol").textContent = course.mark;
    card.querySelector("[data-compare]").setAttribute("aria-label", `Сравнить: ${course.title}`);
    const link = courseLink(course, course.id === "python" ? "Открыть тренажёр" : "К материалам");
    link.className = "course-link";
    card.querySelector(".course-bottom").prepend(link);
    return card;
  }

  function normalize(text) {
    return text.toLocaleLowerCase("ru").replaceAll("ё", "е");
  }

  function renderCatalog(append = false) {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const selected = courses.filter(course => {
      const item = directions[course.category];
      const text = normalize([course.title, course.provider, course.topics, course.description, course.keywords, item.name, item.skill].join(" "));
      return (direction === "all" || direction === course.category) &&
        (levelSelect.value === "all" || levelSelect.value === course.level) &&
        (formatSelect.value === "all" || formatSelect.value === course.format) &&
        (languageSelect.value === "all" || course.lang.includes(languageSelect.value)) &&
        (!freeOnly.checked || course.free) && words.every(word => text.includes(word));
    });
    const visible = selected.slice(0, shown);
    if (append) {
      const newCards = visible.slice(grid.children.length).map(renderCard);
      grid.append(...newCards);
      newCards[0]?.querySelector("h3").focus();
    } else {
      grid.replaceChildren(...visible.map(renderCard));
    }
    $("result-count").textContent = visible.length < selected.length
      ? `Показано ${visible.length} из ${selected.length}` : `Найдено вариантов: ${selected.length}`;
    $("empty-state").hidden = selected.length > 0;
    $("load-more").hidden = visible.length === selected.length;
    $("clear-catalog").hidden = direction === "all" && levelSelect.value === "all" &&
      formatSelect.value === "all" && languageSelect.value === "all" && !freeOnly.checked && !words.length;
    for (const button of $("direction-filters").children) {
      button.setAttribute("aria-pressed", String(button.dataset.filter === direction));
    }
    updateComparison();
  }

  function applyFilters() {
    shown = pageSize;
    renderCatalog();
  }

  function resetFilters(category = "all", free = false) {
    direction = category;
    search.value = "";
    levelSelect.value = formatSelect.value = languageSelect.value = "all";
    freeOnly.checked = free;
    applyFilters();
  }

  $("direction-filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    direction = button.dataset.filter;
    applyFilters();
  });
  search.addEventListener("input", applyFilters);
  for (const input of [levelSelect, formatSelect, languageSelect, freeOnly]) input.addEventListener("change", applyFilters);
  for (const id of ["clear-catalog", "reset-filters"]) {
    $(id).addEventListener("click", () => {
      resetFilters();
      search.focus({ preventScroll: true });
    });
  }
  $("load-more").addEventListener("click", () => {
    shown += pageSize;
    renderCatalog(true);
  });

  function updateComparison(message = "") {
    $("compare-tray").hidden = compareIds.size === 0;
    document.body.classList.toggle("has-comparison", compareIds.size > 0);
    $("compare-count").textContent = `Выбрано ${compareIds.size} из ${compareLimit}`;
    $("open-compare").disabled = compareIds.size < 2;
    $("compare-feedback").textContent = message;
    for (const button of grid.querySelectorAll("[data-compare]")) {
      const selected = compareIds.has(button.dataset.compare);
      button.setAttribute("aria-pressed", String(selected));
    }
  }

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-compare]");
    if (!button) return;
    const id = button.dataset.compare;
    if (compareIds.has(id)) {
      compareIds.delete(id);
      updateComparison("Вариант удалён из сравнения.");
    } else if (compareIds.size < compareLimit) {
      compareIds.add(id);
      updateComparison(`Добавлено к сравнению. Выбрано ${compareIds.size} из ${compareLimit}.`);
    } else {
      $("compare-feedback").textContent = "Можно сравнить до трёх вариантов.";
      $("open-compare").focus();
    }
  });
  $("clear-compare").addEventListener("click", () => {
    compareIds.clear();
    updateComparison();
    $("catalog-title").focus();
  });
  $("open-compare").addEventListener("click", () => {
    const columns = [...compareIds].map(id => {
      const course = courses.find(item => item.id === id);
      const column = document.createElement("article");
      column.className = "compare-column";
      column.innerHTML = `<div class="compare-heading tone-${directions[course.category].tone}"><p>${course.provider}</p><h3>${course.title}</h3></div>
        <dl>
          <div><dt>Уровень</dt><dd>${levels[course.level]}</dd></div>
          <div><dt>Формат</dt><dd>${formats[course.format]}</dd></div>
          <div><dt>Доступ</dt><dd>${course.free ? "Бесплатно" : "Условия на сайте школы"}</dd></div>
          <div><dt>Язык</dt><dd>${course.lang}</dd></div>
          <div><dt>Навыки</dt><dd>${course.topics}</dd></div>
          <div><dt>Первое задание</dt><dd>${course.firstStep}</dd></div>
        </dl>`;
      const link = courseLink(course, "Открыть материал");
      link.className = "button secondary";
      column.append(link);
      return column;
    });
    $("compare-content").replaceChildren(...columns);
    $("compare-dialog").showModal();
    $("compare-title").focus();
  });

  const goals = {
    explore: { title: "Попробовать себя в IT", categories: [] },
    build: { title: "Сделать сайт или приложение", categories: ["code", "mobile", "design", "devops"] },
    analyze: { title: "Работать с данными и ИИ", categories: ["data", "ai", "code"] },
    improve: { title: "Делать продукты удобнее и надёжнее", categories: ["design", "qa", "product", "devops"] }
  };
  const related = {
    code: ["mobile", "devops", "ai"], data: ["ai", "product", "code"], design: ["product", "code", "mobile"],
    ai: ["data", "code"], qa: ["devops", "code", "product"], devops: ["qa", "code"],
    mobile: ["code", "design", "qa"], product: ["design", "data", "qa"]
  };
  const quiz = [
    { title: "Чего вы хотите добиться?", description: "Выберите цель, которая вам ближе сейчас.",
      options: Object.entries(goals).map(([id, item]) => [id, item.title]) },
    { title: "За какую задачу хочется взяться?", description: "По любимой задаче проще найти подходящее направление.",
      options: [...Object.entries(directions).map(([id, item]) => [id, item.skill, item.mark, item.tone]), ["any", "Пока интересно разное"]] },
    { title: "Какой у вас опыт?", description: "Подберём материалы с подходящими требованиями к старту.",
      options: [["start", "Начинаю с нуля"], ["next", "Уже есть базовые знания"], ["any", "Хочу сравнить оба уровня"]] },
    { title: "Как вам удобнее начать?", description: "Формат повлияет на порядок рекомендаций.",
      options: [["free", "Только бесплатные материалы"], ["practice", "Сразу выполнить задание"], ["guide", "Учиться самостоятельно"],
        ["program", "Выбрать программу школы"], ["any", "Подойдут разные форматы"]] }
  ];
  const quizDialog = $("quiz-dialog");
  const quizTitle = $("quiz-title");
  const quizOptions = $("quiz-options");
  let quizStep = 0;
  let answers = [];

  function recommend([goal, interest, level, format]) {
    const preferred = goals[goal].categories;
    const nearby = related[interest] || [];
    const candidates = courses.filter(course => (format !== "free" || course.free) && (level !== "start" || course.level === "start"));
    function score(course) {
      const goalIndex = preferred.indexOf(course.category);
      return (course.category === interest ? 18 : 0) + (nearby.includes(course.category) ? 3 : 0) +
        (goalIndex < 0 ? 0 : preferred.length - goalIndex) + (course.level === level ? 7 : 0) + (course.format === format ? 9 : 0);
    }
    const ranked = candidates.sort((a, b) => score(b) - score(a));
    const result = [];
    for (const course of ranked) {
      const limit = course.category === interest ? 2 : 1;
      if (result.filter(item => item.category === course.category).length === limit) continue;
      result.push(course);
      if (result.length === 3) break;
    }
    return result;
  }

  function showQuiz() {
    const question = quiz[quizStep];
    $("quiz-back").hidden = quizStep === 0;
    $("quiz-restart").hidden = Boolean(question);
    $("quiz-progress").value = Math.min(quizStep + 1, quiz.length);
    quizOptions.replaceChildren();
    quizOptions.className = quizStep === 1 ? "quiz-choices quiz-interests" : "quiz-choices";
    if (question) {
      $("quiz-step").textContent = `Вопрос ${quizStep + 1} из ${quiz.length}`;
      quizTitle.textContent = question.title;
      $("quiz-description").textContent = question.description;
      for (const [id, name, mark, tone] of question.options) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-option";
        if (answers[quizStep] === id) button.classList.add("previous-answer");
        if (mark) {
          const icon = document.createElement("span");
          icon.className = `quiz-icon tone-${tone}`;
          icon.textContent = mark;
          icon.setAttribute("aria-hidden", "true");
          button.append(icon);
        }
        button.append(name);
        button.addEventListener("click", () => {
          answers[quizStep++] = id;
          showQuiz();
          quizTitle.focus();
        });
        quizOptions.append(button);
      }
      return;
    }

    const [, interest, , format] = answers;
    $("quiz-step").textContent = "Результат опроса";
    quizTitle.textContent = "Что попробовать первым";
    $("quiz-description").textContent = interest === "any"
      ? "Подборка из разных областей по вашей цели, опыту и формату."
      : `Основная область — ${directions[interest].name.toLocaleLowerCase("ru")}. Мы также подобрали близкие варианты.`;
    for (const course of recommend(answers)) {
      const item = directions[course.category];
      const card = document.createElement("article");
      card.className = "quiz-result";
      card.innerHTML = `<span class="quiz-icon tone-${item.tone}" aria-hidden="true"></span>
        <div><p class="quiz-result-meta">${item.name} · ${levels[course.level]} · ${course.lang}</p><h3>${course.title}</h3>
        <p>${formats[course.format]} · ${course.free ? "Бесплатно" : "Условия у школы"}</p>
        <p><strong>Первый шаг.</strong> ${course.firstStep}</p></div>`;
      card.firstElementChild.textContent = item.mark;
      const link = courseLink(course, "Открыть материал");
      link.className = "text-link";
      card.lastElementChild.append(link);
      quizOptions.append(card);
    }
    const all = document.createElement("a");
    all.href = "#catalog";
    all.className = "button primary";
    all.textContent = "Смотреть варианты в каталоге";
    all.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      resetFilters(interest === "any" ? "all" : interest, format === "free");
      quizDialog.close();
      if (location.hash !== "#catalog") history.pushState(null, "", "#catalog");
      $("catalog").scrollIntoView();
      $("catalog-title").focus({ preventScroll: true });
    });
    quizOptions.append(all);
  }

  function restartQuiz() {
    answers = [];
    quizStep = 0;
    showQuiz();
  }
  for (const id of ["open-quiz", "banner-quiz"]) {
    $(id).addEventListener("click", () => {
      restartQuiz();
      quizDialog.showModal();
      quizTitle.focus();
    });
  }
  $("quiz-back").addEventListener("click", () => {
    quizStep -= 1;
    showQuiz();
    quizTitle.focus();
  });
  $("quiz-restart").addEventListener("click", () => {
    restartQuiz();
    quizTitle.focus();
  });

  renderCatalog();
})();
