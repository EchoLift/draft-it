const board = document.querySelector("#board");
const boardSurface = document.querySelector("#board-surface");
const projectForm = document.querySelector("#project-form");
const projectTitleInput = document.querySelector("#project-title-input");
const projectList = document.querySelector("#project-list");
const activeProjectTitle = document.querySelector("#active-project-title");
const screenplayProjectTitle = document.querySelector("#screenplay-project-title");
const showProjects = document.querySelector("#show-projects");
const showScreenplay = document.querySelector("#show-screenplay");
const mobileProjectsLink = document.querySelector("#mobile-projects-link");
const mobileScriptLink = document.querySelector("#mobile-script-link");
const scriptToProjects = document.querySelector("#script-to-projects");
const scriptToCards = document.querySelector("#script-to-cards");
const buildScript = document.querySelector("#build-script");
const exportScript = document.querySelector("#export-script");
const screenplayInput = document.querySelector("#screenplay-input");
const scriptCardList = document.querySelector("#script-card-list");
const activeScriptCardTitle = document.querySelector("#active-script-card-title");
const selectAllScriptCards = document.querySelector("#select-all-script-cards");
const formatToolbar = document.querySelector(".format-toolbar");
const form = document.querySelector("#card-form");
const titleInput = document.querySelector("#title-input");
const sceneInput = document.querySelector("#scene-input");
const sequenceList = document.querySelector("#sequence-list");
const emptyState = document.querySelector("#empty-state");
const cardCount = document.querySelector("#card-count");
const saveState = document.querySelector("#save-state");
const zoomLevel = document.querySelector("#zoom-level");
const zoomIn = document.querySelector("#zoom-in");
const zoomOut = document.querySelector("#zoom-out");
const zoomReset = document.querySelector("#zoom-reset");
const clearBoard = document.querySelector("#clear-board");
const mobileAddCard = document.querySelector("#mobile-add-card");
const mobileManageCards = document.querySelector("#mobile-manage-cards");
const mobileCloseButtons = Array.from(document.querySelectorAll(".mobile-close"));
const cardMenu = document.querySelector("#card-menu");
const cardMenuEdit = document.querySelector("#card-menu-edit");
const cardMenuDelete = document.querySelector("#card-menu-delete");
const cardMenuClose = document.querySelector("#card-menu-close");
const sceneModal = document.querySelector("#scene-modal");
const sceneModalClose = document.querySelector("#scene-modal-close");
const sceneModalEmotion = document.querySelector("#scene-modal-emotion");
const sceneModalTitle = document.querySelector("#scene-modal-title");
const sceneModalText = document.querySelector("#scene-modal-text");
const donateModal = document.querySelector("#donate-modal");
const donateModalClose = document.querySelector("#donate-modal-close");
const donateTriggers = Array.from(document.querySelectorAll("[data-donate-trigger]"));
const swatches = Array.from(document.querySelectorAll(".swatch"));
const actionIcon = form.querySelector(".action-icon");
const actionLabel = form.querySelector(".action-label");

const legacyStorageKey = "draft-it-scene-cards";
const projectsStorageKey = "draft-it-projects";
const activeProjectStorageKey = "draft-it-active-project";
const minZoom = 0.03;
const maxZoom = 4;
const emotionByColor = {
  "#ffe08a": "Warmth",
  "#ffadad": "Tension",
  "#9bf6ff": "Relief",
  "#caffbf": "Hope",
  "#ffc6ff": "Romance",
  "#d7d2ff": "Mystery",
};
let projects = loadProjects();
let activeProjectId = localStorage.getItem(activeProjectStorageKey) || projects[0]?.id || null;
let cards = getActiveProject()?.cards || [];
let boardView = getDefaultBoardView();
let activeDrag = null;
let pendingCardDrag = null;
let activePan = null;
let pointerStart = null;
let longPressTimer = null;
let longPressCardId = null;
let longPressOpened = false;
let cardMenuCardId = null;
let sequenceDragId = null;
let editingCardId = null;
let activeScriptCardId = null;
let selectedExportCardIds = new Set();
let exportSelectionTouched = false;
let screenplayLineMemory = new Map();

function loadProjects() {
  try {
    const stored = JSON.parse(localStorage.getItem(projectsStorageKey));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {
  }

  const legacyCards = loadLegacyCards();
  if (legacyCards.length) {
    const migrated = [{
      id: crypto.randomUUID(),
      title: "First Draft",
      cards: legacyCards,
      screenplay: "",
      createdAt: new Date().toISOString(),
    }];
    localStorage.setItem(projectsStorageKey, JSON.stringify(migrated));
    localStorage.setItem(activeProjectStorageKey, migrated[0].id);
    return migrated;
  }

  return [];
}

function loadLegacyCards() {
  try {
    return JSON.parse(localStorage.getItem(legacyStorageKey)) || [];
  } catch {
    return [];
  }
}

function getActiveProject() {
  return projects.find((project) => project.id === activeProjectId) || null;
}

function saveProjects() {
  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
  if (activeProjectId) localStorage.setItem(activeProjectStorageKey, activeProjectId);
}

function saveCards() {
  const project = getActiveProject();
  if (project) project.cards = cards;
  saveProjects();
  saveState.textContent = "Saved locally";
}

function setEditingMode(cardId = null) {
  editingCardId = cardId;
  actionIcon.textContent = cardId ? "✓" : "+";
  actionLabel.textContent = cardId ? "Update card" : "Stick to board";
}

function setLayer(layer) {
  document.body.dataset.layer = layer;
  closeMobilePanels();
  hideCardMenu();
  closeSceneModal();
  if (layer === "projects") renderProjects();
  if (layer === "screenplay") renderScreenplay();
}

function setActiveProject(id, layer = "cards") {
  activeProjectId = id;
  const project = getActiveProject();
  cards = project?.cards || [];
  activeScriptCardId = cards[0]?.id || null;
  selectedExportCardIds = new Set(cards.map((card) => card.id));
  exportSelectionTouched = false;
  boardView = getDefaultBoardView();
  setEditingMode();
  resetFormDefaults();
  saveProjects();
  applyBoardView();
  render();
  setLayer(layer);
}

function renderProjects() {
  projectList.innerHTML = "";

  if (!projects.length) {
    const empty = document.createElement("div");
    empty.className = "project-card";
    empty.innerHTML = "<h2>No projects yet</h2><p class=\"project-meta\">Create a screenplay project to start building cards.</p>";
    projectList.append(empty);
    return;
  }

  projects.forEach((project) => {
    const item = document.createElement("article");
    item.className = "project-card";
    item.innerHTML = `
      <h2></h2>
      <p class="project-meta"></p>
      <div class="project-card-actions">
        <button class="primary-action" type="button" data-open-project="${project.id}">Cards</button>
        <button class="zoom-button" type="button" data-open-script="${project.id}">Script</button>
      </div>
    `;
    item.querySelector("h2").textContent = project.title;
    item.querySelector(".project-meta").textContent =
      `${project.cards.length} ${project.cards.length === 1 ? "card" : "cards"}`;
    projectList.append(item);
  });
}

function createProject(event) {
  event.preventDefault();
  const title = projectTitleInput.value.trim();
  if (!title) return;

  const project = {
    id: crypto.randomUUID(),
    title,
    cards: [],
    screenplay: "",
    createdAt: new Date().toISOString(),
  };
  projects.unshift(project);
  projectTitleInput.value = "";
  setActiveProject(project.id, "cards");
}

function renderScreenplay() {
  const project = getActiveProject();
  if (!project) {
    setLayer("projects");
    return;
  }

  screenplayProjectTitle.textContent = project.title;
  if (!activeScriptCardId || !project.cards.some((card) => card.id === activeScriptCardId)) {
    activeScriptCardId = project.cards[0]?.id || null;
  }
  if (!exportSelectionTouched && !selectedExportCardIds.size) {
    selectedExportCardIds = new Set(project.cards.map((card) => card.id));
  }

  scriptCardList.innerHTML = "";

  project.cards.forEach((card, index) => {
    const item = document.createElement("li");
    item.className = card.id === activeScriptCardId ? "is-active" : "";
    item.dataset.scriptCardId = card.id;
    item.style.setProperty("--item-color", card.color);
    item.innerHTML = `
      <input type="checkbox" class="script-card-check" aria-label="Select for export" />
      <div>
        <strong></strong>
        <span></span>
      </div>
    `;
    item.querySelector(".script-card-check").checked = selectedExportCardIds.has(card.id);
    item.querySelector("strong").textContent = `${index + 1}. ${card.title}`;
    item.querySelector("span").textContent = emotionByColor[card.color] || "Scene beat";
    scriptCardList.append(item);
  });

  renderActiveCardScreenplay();
  selectAllScriptCards.checked = project.cards.length > 0 && project.cards.every((card) => selectedExportCardIds.has(card.id));
}

function renderActiveCardScreenplay() {
  const project = getActiveProject();
  const card = project?.cards.find((item) => item.id === activeScriptCardId);

  if (!card) {
    activeScriptCardTitle.textContent = "Select a card";
    screenplayInput.value = "";
    screenplayInput.disabled = true;
    return;
  }

  activeScriptCardTitle.textContent = `${card.title} screenplay`;
  screenplayInput.disabled = false;
  screenplayInput.value = card.screenplay || "";
  screenplayLineMemory = new Map();
}

function saveScreenplay() {
  const project = getActiveProject();
  if (!project) return;
  const card = project.cards.find((item) => item.id === activeScriptCardId);
  if (!card) return;
  card.screenplay = screenplayInput.value;
  saveProjects();
  saveState.textContent = "Saved locally";
}

function normalizeLineText(line) {
  return line.trim().replace(/^\((.*)\)$/, "$1").trim();
}

function isFormattedLike(original, line) {
  const trimmed = line.trim();
  return (
    trimmed === original.toUpperCase() ||
    trimmed === original.replace(/[A-Za-z]/, (match) => match.toUpperCase()) ||
    trimmed === `(${original})` ||
    trimmed === original.toUpperCase().replace(/:?$/, ":")
  );
}

function getOriginalLineText(lineStart, line) {
  const remembered = screenplayLineMemory.get(lineStart);
  if (remembered && isFormattedLike(remembered, line)) return remembered;

  const original = normalizeLineText(line);
  screenplayLineMemory.set(lineStart, original);
  return original;
}

function seedActiveCardScreenplay() {
  const project = getActiveProject();
  const card = project?.cards.find((item) => item.id === activeScriptCardId);
  if (!card) return;

  screenplayInput.value = screenplayInput.value.trim()
    ? `${screenplayInput.value.trim()}\n\n${card.scene}`
    : card.scene;
  saveScreenplay();
}

function getScreenplayLineClass(line) {
  const trimmed = line.trim();
  const leadingSpaces = line.length - line.trimStart().length;
  const upper = trimmed.toUpperCase();

  if (!trimmed) return "blank-line";
  if (leadingSpaces >= 28 || (/^[A-Z0-9 .'-]+:$/.test(trimmed) && upper === trimmed)) return "transition";
  if (/^\(.+\)$/.test(trimmed)) return "parenthetical";
  if (leadingSpaces >= 18 && upper === trimmed && trimmed.length <= 32) return "character";
  if (leadingSpaces >= 8) return "dialogue";
  if (/^(\.?INT\.?|\-?EXT\.?|INT\/EXT\.?|I\/E\.?)/i.test(trimmed)) return "scene-heading";
  return "action";
}

function renderFormattedScreenplay(text) {
  return String(text || "")
    .split("\n")
    .map((line) => {
      const className = getScreenplayLineClass(line);
      if (className === "blank-line") return '<div class="script-line blank-line">&nbsp;</div>';
      return `<div class="script-line ${className}">${escapeHtml(line.trim())}</div>`;
    })
    .join("");
}

function exportCurrentProject() {
  const project = getActiveProject();
  if (!project) return;

  saveScreenplay();
  const selectedCards = project.cards.filter((card) => selectedExportCardIds.has(card.id));
  if (!selectedCards.length) {
    alert("Select at least one card to export.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Allow pop-ups to export the screenplay PDF.");
    return;
  }

  const title = escapeHtml(project.title);
  const body = selectedCards
    .map((card, index) => `
      <section class="scene">
        <h2>Scene ${index + 1}: ${escapeHtml(card.title)}</h2>
        <p class="emotion">${escapeHtml(emotionByColor[card.color] || "Scene beat")}</p>
        <div class="script-page">${renderFormattedScreenplay(card.screenplay || card.scene || "")}</div>
      </section>
    `)
    .join("");

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: letter; margin: 0.65in 0.7in; }
          body { font-family: Courier, monospace; margin: 0; color: #111; }
          h1 { font-family: Arial, sans-serif; margin-bottom: 32px; }
          h2 { font-family: Arial, sans-serif; font-size: 18px; margin: 0 0 6px; }
          .emotion { font-family: Arial, sans-serif; color: #666; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          .scene { break-after: page; margin-bottom: 32px; }
          .scene:last-child { break-after: auto; }
          .script-page { width: 100%; font: 12pt/1.45 Courier, monospace; }
          .script-line { min-height: 1.45em; white-space: pre-wrap; overflow-wrap: break-word; }
          .scene-heading,
          .action,
          .shot { width: 100%; }
          .character {
            width: 3.4in;
            margin-left: 1.45in;
            text-align: center;
          }
          .parenthetical {
            width: 2.6in;
            margin-left: 1.85in;
            text-align: left;
          }
          .dialogue {
            width: 3.45in;
            margin-left: 1.45in;
            margin-right: auto;
            text-align: left;
          }
          .transition {
            width: 100%;
            text-align: right;
          }
          .blank-line { height: 1.45em; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${body}
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function getCurrentLineRange(textarea) {
  const value = textarea.value;
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", textarea.selectionEnd);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  return { lineStart, lineEnd, line: value.slice(lineStart, lineEnd) };
}

function formatScreenplayLine(mode) {
  if (screenplayInput.disabled) return;

  const { lineStart, lineEnd, line } = getCurrentLineRange(screenplayInput);
  const original = getOriginalLineText(lineStart, line);
  const formats = {
    scene: () => original.toUpperCase(),
    action: () => original.replace(/[A-Za-z]/, (match) => match.toUpperCase()),
    character: () => `                    ${original.toUpperCase()}`,
    dialogue: () => `          ${original}`,
    parenthetical: () => `               (${original})`,
    transition: () => `                              ${original.toUpperCase().replace(/:?$/, ":")}`,
    shot: () => original.toUpperCase(),
  };
  const replacement = (formats[mode] || formats.action)();
  const value = screenplayInput.value;

  screenplayInput.value = `${value.slice(0, lineStart)}${replacement}${value.slice(lineEnd)}`;
  screenplayInput.focus();
  const cursor = lineStart + replacement.length;
  screenplayInput.setSelectionRange(cursor, cursor);
  saveScreenplay();
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 840px)").matches;
}

function getDefaultBoardView() {
  return { x: 0, y: 0, scale: isMobileLayout() ? 0.5 : 1 };
}

function getTapTolerance() {
  return isMobileLayout() ? 22 : 8;
}

function openMobileAdd() {
  document.body.classList.add("is-adding-card");
  document.body.classList.remove("is-managing-cards");
  hideCardMenu();
}

function openMobileManage() {
  document.body.classList.add("is-managing-cards");
  document.body.classList.remove("is-adding-card");
  hideCardMenu();
}

function closeMobilePanels() {
  document.body.classList.remove("is-adding-card", "is-managing-cards");
}

function hideCardMenu() {
  cardMenu.hidden = true;
  cardMenuCardId = null;
}

function showCardMenu(cardElement) {
  if (!isMobileLayout()) return;

  const rect = cardElement.getBoundingClientRect();
  const menuWidth = 220;
  cardMenuCardId = cardElement.dataset.id;
  cardMenu.style.left = `${clamp(rect.right - menuWidth, 12, window.innerWidth - menuWidth - 12)}px`;
  cardMenu.style.top = `${clamp(rect.top + 12, 12, window.innerHeight - 160)}px`;
  cardMenu.hidden = false;
  cardElement.classList.add("is-focused");
}

function resetFormDefaults() {
  form.reset();
  document.querySelector('input[name="color"][value="#ffe08a"]').checked = true;
  updateSwatches();
}

function getScenePreview(scene) {
  const words = scene.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 16) return scene;
  return `${words.slice(0, 16).join(" ")}...`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function openSceneModal(id) {
  const card = cards.find((item) => item.id === id);
  if (!card) return;

  hideCardMenu();
  sceneModal.querySelector(".scene-modal-card").style.setProperty("--modal-card-color", card.color);
  sceneModalEmotion.textContent = emotionByColor[card.color] || "Scene beat";
  sceneModalTitle.textContent = card.title;
  sceneModalText.textContent = card.scene;
  sceneModal.hidden = false;
}

function closeSceneModal() {
  sceneModal.hidden = true;
}

function openDonateModal(event) {
  event.preventDefault();
  donateModal.hidden = false;
}

function closeDonateModal() {
  donateModal.hidden = true;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function applyBoardView() {
  boardSurface.style.transform = `translate(${boardView.x}px, ${boardView.y}px) scale(${boardView.scale})`;
  zoomLevel.textContent = `${Math.round(boardView.scale * 100)}%`;
}

function screenToBoard(clientX, clientY) {
  const rect = board.getBoundingClientRect();
  return {
    x: (clientX - rect.left - boardView.x) / boardView.scale,
    y: (clientY - rect.top - boardView.y) / boardView.scale,
  };
}

function zoomBoard(nextScale, originClientX = board.clientWidth / 2, originClientY = board.clientHeight / 2) {
  const rect = board.getBoundingClientRect();
  const originX = originClientX - rect.left;
  const originY = originClientY - rect.top;
  const oldScale = boardView.scale;
  const scale = clamp(nextScale, minZoom, maxZoom);
  const worldX = (originX - boardView.x) / oldScale;
  const worldY = (originY - boardView.y) / oldScale;

  boardView.scale = scale;
  boardView.x = originX - worldX * scale;
  boardView.y = originY - worldY * scale;
  applyBoardView();
}

function cardTemplate(card, index) {
  const element = document.createElement("div");
  element.className = "scene-card";
  element.style.setProperty("--card-color", card.color);
  element.style.left = `${card.x}px`;
  element.style.top = `${card.y}px`;
  element.dataset.id = card.id;
  element.tabIndex = 0;
  element.setAttribute("aria-label", `Scene ${index + 1}: ${card.title}`);

  element.innerHTML = `
    <span class="card-pin" aria-hidden="true"></span>
    <div class="card-actions">
      <button type="button" data-action="edit" title="Edit card" aria-label="Edit card">✎</button>
      <button type="button" data-action="delete" title="Delete card" aria-label="Delete card">×</button>
    </div>
    <article>
      <span class="emotion-label"></span>
      <h3></h3>
      <p></p>
    </article>
  `;

  element.querySelector(".emotion-label").textContent = emotionByColor[card.color] || "Scene beat";
  element.querySelector("h3").textContent = card.title;
  element.querySelector("p").textContent = getScenePreview(card.scene);
  return element;
}

function render() {
  const project = getActiveProject();
  activeProjectTitle.textContent = project ? project.title : "Move cards anywhere";
  boardSurface.querySelectorAll(".scene-card").forEach((card) => card.remove());

  cards.forEach((card, index) => {
    boardSurface.append(cardTemplate(card, index));
  });

  sequenceList.innerHTML = "";
  cards.forEach((card, index) => {
    const item = document.createElement("li");
    item.className = "sequence-item";
    item.draggable = true;
    item.dataset.id = card.id;
    item.style.setProperty("--item-color", card.color);
    item.innerHTML = `
      <span class="sequence-number">${index + 1}</span>
      <span class="sequence-copy">
        <span class="sequence-title"></span>
        <span class="sequence-emotion"></span>
      </span>
      <span class="sequence-controls">
        <button type="button" data-move="up" title="Move earlier" aria-label="Move earlier">↑</button>
        <button type="button" data-move="down" title="Move later" aria-label="Move later">↓</button>
      </span>
    `;
    item.querySelector(".sequence-title").textContent = card.title;
    item.querySelector(".sequence-emotion").textContent = emotionByColor[card.color] || "Scene beat";
    sequenceList.append(item);
  });

  emptyState.hidden = cards.length > 0;
  cardCount.textContent = `${cards.length} ${cards.length === 1 ? "card" : "cards"}`;
}

function nextPosition() {
  const center = screenToBoard(
    board.getBoundingClientRect().left + board.clientWidth / 2,
    board.getBoundingClientRect().top + board.clientHeight / 2,
  );
  const offset = cards.length * 28;
  return {
    x: center.x - 120 + offset,
    y: center.y - 84 + offset,
  };
}

function addCard(event) {
  event.preventDefault();
  if (!getActiveProject()) {
    setLayer("projects");
    return;
  }
  const title = titleInput.value.trim();
  const scene = sceneInput.value.trim();
  const color = new FormData(form).get("color");

  if (!title || !scene) return;

  if (editingCardId) {
    const card = cards.find((item) => item.id === editingCardId);
    if (card) {
      card.title = title;
      card.scene = scene;
      card.color = color;
      setEditingMode();
      resetFormDefaults();
      titleInput.focus();
      saveCards();
      render();
      if (isMobileLayout()) closeMobilePanels();
      return;
    }

    setEditingMode();
  }

  cards.push({
    id: crypto.randomUUID(),
    title,
    scene,
    color,
    ...nextPosition(),
  });
  selectedExportCardIds.add(cards[cards.length - 1].id);

  resetFormDefaults();
  titleInput.focus();
  saveCards();
  render();
  if (isMobileLayout()) closeMobilePanels();
}

function updateSwatches() {
  swatches.forEach((swatch) => {
    const input = swatch.querySelector("input");
    swatch.classList.toggle("is-selected", input.checked);
  });
}

function beginCardDrag(event) {
  const card = event.target.closest(".scene-card");
  if (!card || event.target.closest("button")) return;

  activateCardDrag(card, event);
}

function activateCardDrag(card, event) {
  const data = cards.find((item) => item.id === card.dataset.id);
  if (!data) return;

  const pointer = screenToBoard(event.clientX, event.clientY);

  activeDrag = {
    id: data.id,
    element: card,
    offsetX: pointer.x - data.x,
    offsetY: pointer.y - data.y,
  };

  card.classList.add("is-dragging");
  board.setPointerCapture(event.pointerId);
}

function startLongPress(event) {
  const card = event.target.closest(".scene-card");
  if (!card || event.target.closest("button") || !isMobileLayout()) return;

  longPressCardId = card.dataset.id;
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (longPressCardId !== card.dataset.id) return;
    if (activeDrag?.element) activeDrag.element.classList.remove("is-dragging");
    activeDrag = null;
    activePan = null;
    longPressOpened = true;
    showCardMenu(card);
  }, 650);
}

function cancelLongPress() {
  clearTimeout(longPressTimer);
  longPressTimer = null;
  longPressCardId = null;
}

function moveCard(event) {
  if (!activeDrag) return;

  const card = cards.find((item) => item.id === activeDrag.id);
  if (!card) return;

  const pointer = screenToBoard(event.clientX, event.clientY);
  card.x = pointer.x - activeDrag.offsetX;
  card.y = pointer.y - activeDrag.offsetY;
  activeDrag.element.style.left = `${card.x}px`;
  activeDrag.element.style.top = `${card.y}px`;
  saveState.textContent = "Moving...";
}

function endCardDrag() {
  if (!activeDrag) return;
  activeDrag.element.classList.remove("is-dragging");
  activeDrag = null;
  saveCards();
}

function beginBoardPointer(event) {
  startLongPress(event);
  const tappedCard = event.target.closest(".scene-card");
  const tappedButton = event.target.closest("button");
  pointerStart = {
    targetCardId: tappedCard?.dataset.id || null,
    x: event.clientX,
    y: event.clientY,
  };

  if (tappedCard) {
    if (isMobileLayout() && !tappedButton) {
      pendingCardDrag = { element: tappedCard, event };
      board.setPointerCapture(event.pointerId);
      return;
    }

    beginCardDrag(event);
    return;
  }

  activePan = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    viewX: boardView.x,
    viewY: boardView.y,
  };
  board.classList.add("is-panning");
  board.setPointerCapture(event.pointerId);
}

function moveBoardPointer(event) {
  const movedDistance = pointerStart
    ? Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y)
    : 0;

  if (
    longPressTimer &&
    pointerStart &&
    movedDistance > getTapTolerance()
  ) {
    cancelLongPress();
  }

  if (pendingCardDrag && movedDistance > getTapTolerance()) {
    activateCardDrag(pendingCardDrag.element, event);
    pendingCardDrag = null;
  }

  if (activeDrag) {
    moveCard(event);
    return;
  }

  if (!activePan) return;

  boardView.x = activePan.viewX + event.clientX - activePan.startX;
  boardView.y = activePan.viewY + event.clientY - activePan.startY;
  applyBoardView();
}

function endBoardPointer(event) {
  const pointerEnd = event;
  const tappedCardId = pointerStart?.targetCardId;
  const tappedButton = pointerEnd?.target?.closest?.("button");
  const moved = pointerStart && Math.hypot(pointerEnd.clientX - pointerStart.x, pointerEnd.clientY - pointerStart.y) > getTapTolerance();

  cancelLongPress();
  endCardDrag();
  if (tappedCardId && (!tappedButton || tappedButton.closest(".scene-card") === null) && !moved && !longPressOpened) {
    openSceneModal(tappedCardId);
  }
  pendingCardDrag = null;
  pointerStart = null;
  longPressOpened = false;

  if (!activePan) return;
  activePan = null;
  board.classList.remove("is-panning");
}

function handleBoardWheel(event) {
  event.preventDefault();

  if (event.ctrlKey || event.metaKey) {
    const zoomFactor = Math.exp(-event.deltaY * 0.01);
    zoomBoard(boardView.scale * zoomFactor, event.clientX, event.clientY);
    return;
  }

  boardView.x -= event.deltaX;
  boardView.y -= event.deltaY;
  applyBoardView();
}

function handlePageZoomKeys(event) {
  if (!event.ctrlKey && !event.metaKey) return;

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    zoomBoard(boardView.scale * 1.15);
  }

  if (event.key === "-") {
    event.preventDefault();
    zoomBoard(boardView.scale / 1.15);
  }

  if (event.key === "0") {
    event.preventDefault();
    boardView = getDefaultBoardView();
    applyBoardView();
  }
}

function handleCardAction(event) {
  const button = event.target.closest("button");
  const cardElement = event.target.closest(".scene-card");
  if (!cardElement) return;

  const id = cardElement.dataset.id;
  const card = cards.find((item) => item.id === id);
  if (!card) return;

  if (!button) {
    const moved = pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > getTapTolerance();
    if (!moved && !longPressOpened) openSceneModal(id);
    pointerStart = null;
    longPressOpened = false;
    return;
  }

  if (button.dataset.action === "delete") {
    deleteCard(id);
    return;
  }

  if (button.dataset.action === "edit") {
    editCard(id, cardElement);
  }
}

function editCard(id, cardElement = null) {
  const card = cards.find((item) => item.id === id);
  if (!card) return;

  setEditingMode(id);
  titleInput.value = card.title;
  sceneInput.value = card.scene;
  const colorInput = document.querySelector(`input[name="color"][value="${card.color}"]`);
  if (colorInput) colorInput.checked = true;
  updateSwatches();
  if (cardElement) cardElement.classList.add("is-focused");
  if (isMobileLayout()) openMobileAdd();
  titleInput.focus();
}

function deleteCard(id) {
  const card = cards.find((item) => item.id === id);
  if (!card) return;

  const shouldDelete = confirm(`Delete "${card.title}"? This cannot be undone.`);
  if (!shouldDelete) return;

  cards = cards.filter((item) => item.id !== id);
  if (editingCardId === id) setEditingMode();
  selectedExportCardIds.delete(id);
  if (activeScriptCardId === id) activeScriptCardId = cards[0]?.id || null;
  hideCardMenu();
  saveCards();
  render();
}

function handleSequenceDragStart(event) {
  const item = event.target.closest(".sequence-item");
  if (!item) return;
  sequenceDragId = item.dataset.id;
  event.dataTransfer.effectAllowed = "move";
}

function handleSequenceDragOver(event) {
  const item = event.target.closest(".sequence-item");
  if (!item || item.dataset.id === sequenceDragId) return;
  event.preventDefault();
  item.classList.add("drag-over");
}

function handleSequenceDragLeave(event) {
  const item = event.target.closest(".sequence-item");
  if (item) item.classList.remove("drag-over");
}

function handleSequenceDrop(event) {
  const item = event.target.closest(".sequence-item");
  if (!item || !sequenceDragId) return;
  event.preventDefault();
  item.classList.remove("drag-over");

  const from = cards.findIndex((card) => card.id === sequenceDragId);
  const to = cards.findIndex((card) => card.id === item.dataset.id);
  if (from < 0 || to < 0 || from === to) return;

  const [moved] = cards.splice(from, 1);
  cards.splice(to, 0, moved);
  sequenceDragId = null;
  saveCards();
  render();
}

function moveSequenceItem(event) {
  const button = event.target.closest("[data-move]");
  const item = event.target.closest(".sequence-item");
  if (!button || !item) return;

  const from = cards.findIndex((card) => card.id === item.dataset.id);
  const direction = button.dataset.move === "up" ? -1 : 1;
  const to = from + direction;
  if (from < 0 || to < 0 || to >= cards.length) return;

  const [moved] = cards.splice(from, 1);
  cards.splice(to, 0, moved);
  saveCards();
  render();
}

function clearAllCards() {
  if (!cards.length) return;
  const shouldClear = confirm(`Delete all ${cards.length} cards? This cannot be undone.`);
  if (!shouldClear) return;

  cards = [];
  selectedExportCardIds = new Set();
  activeScriptCardId = null;
  setEditingMode();
  resetFormDefaults();
  hideCardMenu();
  saveCards();
  render();
}

form.addEventListener("submit", addCard);
projectForm.addEventListener("submit", createProject);
projectList.addEventListener("click", (event) => {
  const cardsButton = event.target.closest("[data-open-project]");
  const scriptButton = event.target.closest("[data-open-script]");
  if (cardsButton) setActiveProject(cardsButton.dataset.openProject, "cards");
  if (scriptButton) setActiveProject(scriptButton.dataset.openScript, "screenplay");
});
swatches.forEach((swatch) => swatch.addEventListener("change", updateSwatches));
board.addEventListener("pointerdown", beginBoardPointer);
board.addEventListener("pointermove", moveBoardPointer);
board.addEventListener("pointerup", endBoardPointer);
board.addEventListener("pointercancel", endBoardPointer);
board.addEventListener("wheel", handleBoardWheel, { passive: false });
board.addEventListener("click", handleCardAction);
zoomOut.addEventListener("click", () => zoomBoard(boardView.scale / 1.2));
zoomIn.addEventListener("click", () => zoomBoard(boardView.scale * 1.2));
zoomReset.addEventListener("click", () => {
  boardView = getDefaultBoardView();
  applyBoardView();
});
showProjects.addEventListener("click", () => setLayer("projects"));
showScreenplay.addEventListener("click", () => setLayer("screenplay"));
mobileProjectsLink.addEventListener("click", () => setLayer("projects"));
mobileScriptLink.addEventListener("click", () => setLayer("screenplay"));
scriptToProjects.addEventListener("click", () => setLayer("projects"));
scriptToCards.addEventListener("click", () => setLayer("cards"));
buildScript.addEventListener("click", seedActiveCardScreenplay);
exportScript.addEventListener("click", exportCurrentProject);
screenplayInput.addEventListener("input", saveScreenplay);
formatToolbar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-format]");
  if (!button) return;
  formatScreenplayLine(button.dataset.format);
});
selectAllScriptCards.addEventListener("change", () => {
  const project = getActiveProject();
  if (!project) return;
  exportSelectionTouched = true;
  selectedExportCardIds = selectAllScriptCards.checked
    ? new Set(project.cards.map((card) => card.id))
    : new Set();
  renderScreenplay();
});
scriptCardList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-script-card-id]");
  if (!item) return;

  if (event.target.classList.contains("script-card-check")) {
    exportSelectionTouched = true;
    if (event.target.checked) selectedExportCardIds.add(item.dataset.scriptCardId);
    else selectedExportCardIds.delete(item.dataset.scriptCardId);
    renderScreenplay();
    return;
  }

  saveScreenplay();
  activeScriptCardId = item.dataset.scriptCardId;
  renderScreenplay();
});
mobileAddCard.addEventListener("click", () => {
  setEditingMode();
  resetFormDefaults();
  openMobileAdd();
  titleInput.focus();
});
mobileManageCards.addEventListener("click", openMobileManage);
mobileCloseButtons.forEach((button) => button.addEventListener("click", () => {
  closeMobilePanels();
  hideCardMenu();
}));
cardMenuClose.addEventListener("click", hideCardMenu);
cardMenuEdit.addEventListener("click", () => {
  editCard(cardMenuCardId, document.querySelector(`.scene-card[data-id="${cardMenuCardId}"]`));
  hideCardMenu();
});
cardMenuDelete.addEventListener("click", () => deleteCard(cardMenuCardId));
sceneModalClose.addEventListener("click", closeSceneModal);
sceneModal.addEventListener("click", (event) => {
  if (event.target === sceneModal) closeSceneModal();
});
donateTriggers.forEach((trigger) => trigger.addEventListener("click", openDonateModal));
donateModalClose.addEventListener("click", closeDonateModal);
donateModal.addEventListener("click", (event) => {
  if (event.target === donateModal) closeDonateModal();
});
sequenceList.addEventListener("dragstart", handleSequenceDragStart);
sequenceList.addEventListener("dragover", handleSequenceDragOver);
sequenceList.addEventListener("dragleave", handleSequenceDragLeave);
sequenceList.addEventListener("drop", handleSequenceDrop);
sequenceList.addEventListener("click", moveSequenceItem);
clearBoard.addEventListener("click", clearAllCards);
document.addEventListener("keydown", handlePageZoomKeys);
document.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  },
  { passive: false },
);

applyBoardView();
renderProjects();
if (activeProjectId && getActiveProject()) {
  render();
  setLayer("projects");
} else {
  setLayer("projects");
}
