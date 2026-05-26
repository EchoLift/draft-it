const board = document.querySelector("#board");
const boardSurface = document.querySelector("#board-surface");
const projectForm = document.querySelector("#project-form");
const projectTitleInput = document.querySelector("#project-title-input");
const projectAuthorInput = document.querySelector("#project-author-input");
const projectList = document.querySelector("#project-list");
const manualBackup = document.querySelector("#manual-backup");
const importBackupInput = document.querySelector("#import-backup-input");
const autoBackupToggle = document.querySelector("#auto-backup-toggle");
const backupStatus = document.querySelector("#backup-status");
const activeProjectTitle = document.querySelector("#active-project-title");
const screenplayProjectTitle = document.querySelector("#screenplay-project-title");
const showProjects = document.querySelector("#show-projects");
const showCharacters = document.querySelector("#show-characters");
const showScreenplay = document.querySelector("#show-screenplay");
const scriptToProjects = document.querySelector("#script-to-projects");
const scriptToCards = document.querySelector("#script-to-cards");
const scriptToCharacters = document.querySelector("#script-to-characters");
const treeProjectTitle = document.querySelector("#tree-project-title");
const treeToProjects = document.querySelector("#tree-to-projects");
const treeToCards = document.querySelector("#tree-to-cards");
const treeToScript = document.querySelector("#tree-to-script");
const treeOpenCharacters = document.querySelector("#tree-open-characters");
const treeCharacterSelect = document.querySelector("#tree-character-select");
const treeAddNode = document.querySelector("#tree-add-node");
const treeRelationFrom = document.querySelector("#tree-relation-from");
const treeRelationTo = document.querySelector("#tree-relation-to");
const treeRelationInput = document.querySelector("#tree-relation-input");
const treeAddRelation = document.querySelector("#tree-add-relation");
const treeBoard = document.querySelector("#tree-board");
const treeSurface = document.querySelector("#tree-surface");
const treeLines = document.querySelector("#tree-lines");
const treeEmpty = document.querySelector("#tree-empty");
const treeZoomOut = document.querySelector("#tree-zoom-out");
const treeZoomIn = document.querySelector("#tree-zoom-in");
const treeZoomReset = document.querySelector("#tree-zoom-reset");
const treeZoomLevel = document.querySelector("#tree-zoom-level");
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
const charactersModal = document.querySelector("#characters-modal");
const charactersModalClose = document.querySelector("#characters-modal-close");
const charactersProjectTitle = document.querySelector("#characters-project-title");
const characterTreeButton = document.querySelector("#character-tree-button");
const characterForm = document.querySelector("#character-form");
const characterAddButton = document.querySelector("#character-add-button");
const characterFormClose = document.querySelector("#character-form-close");
const characterNameInput = document.querySelector("#character-name-input");
const characterGoalInput = document.querySelector("#character-goal-input");
const characterFearInput = document.querySelector("#character-fear-input");
const characterLieInput = document.querySelector("#character-lie-input");
const characterGenderInput = document.querySelector("#character-gender-input");
const characterShadeInput = document.querySelector("#character-shade-input");
const characterScreenTimeInput = document.querySelector("#character-screen-time-input");
const characterStrip = document.querySelector("#character-strip");
const characterDetail = document.querySelector("#character-detail");
const characterSubmitButton = characterForm.querySelector(".primary-action");
const exportModal = document.querySelector("#export-modal");
const exportModalClose = document.querySelector("#export-modal-close");
const exportIncludeCharacters = document.querySelector("#export-include-characters");
const exportCharacterList = document.querySelector("#export-character-list");
const exportCancel = document.querySelector("#export-cancel");
const exportConfirm = document.querySelector("#export-confirm");
const donateModal = document.querySelector("#donate-modal");
const donateModalClose = document.querySelector("#donate-modal-close");
const donateTriggers = Array.from(document.querySelectorAll("[data-donate-trigger]"));
const swatches = Array.from(document.querySelectorAll(".swatch"));
const actionIcon = form.querySelector(".action-icon");
const actionLabel = form.querySelector(".action-label");

const legacyStorageKey = "draft-it-scene-cards";
const projectsStorageKey = "draft-it-projects";
const activeProjectStorageKey = "draft-it-active-project";
const activeLayerStorageKey = "draft-it-active-layer";
const autoBackupStorageKey = "draft-it-auto-backup";
const backupIntervalMs = 5 * 60 * 1000;
const backupTimezone = "Asia/Kolkata";
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
let treeView = getDefaultBoardView();
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
let activeCharacterId = null;
let selectedExportCardIds = new Set();
let exportSelectionTouched = false;
let screenplayLineMemory = new Map();
let autoBackupTimer = null;
let activeTreeDrag = null;

function loadProjects() {
  try {
    const stored = JSON.parse(localStorage.getItem(projectsStorageKey));
    if (Array.isArray(stored) && stored.length) return stored.map(ensureProjectCollections);
  } catch {
  }

  const legacyCards = loadLegacyCards();
  if (legacyCards.length) {
    const migrated = [{
      id: crypto.randomUUID(),
      title: "First Draft",
      author: "",
      cards: legacyCards,
      characters: [],
      screenplay: "",
      createdAt: new Date().toISOString(),
    }];
    localStorage.setItem(projectsStorageKey, JSON.stringify(migrated));
    localStorage.setItem(activeProjectStorageKey, migrated[0].id);
    return migrated;
  }

  return [];
}

function ensureProjectCollections(project) {
  project.author = project.author || "";
  project.cards = Array.isArray(project.cards) ? project.cards : [];
  project.characters = Array.isArray(project.characters) ? project.characters : [];
  project.characterTree = project.characterTree && typeof project.characterTree === "object"
    ? project.characterTree
    : { nodes: [], links: [] };
  project.characterTree.nodes = Array.isArray(project.characterTree.nodes) ? project.characterTree.nodes : [];
  project.characterTree.links = Array.isArray(project.characterTree.links) ? project.characterTree.links : [];
  project.characters.forEach((character) => {
    if (character.shade === "RED") character.shade = "WHITE";
    character.gender = character.gender || "OTHER";
  });
  return project;
}

function loadLegacyCards() {
  try {
    return JSON.parse(localStorage.getItem(legacyStorageKey)) || [];
  } catch {
    return [];
  }
}

function getActiveProject() {
  const project = projects.find((item) => item.id === activeProjectId) || null;
  return project ? ensureProjectCollections(project) : null;
}

function saveProjects() {
  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
  if (activeProjectId) localStorage.setItem(activeProjectStorageKey, activeProjectId);
}

function getDraftItBackupPayload() {
  projects.forEach(ensureProjectCollections);
  const exportedAt = new Date();
  return {
    app: "Draft It",
    format: "draftit",
    version: 1,
    exportedAt: exportedAt.toISOString(),
    exportedAtIst: formatIstTimestamp(exportedAt),
    timezone: backupTimezone,
    activeProjectId,
    projects,
  };
}

function formatIstTimestamp(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: backupTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date).reduce((values, part) => {
    values[part.type] = part.value;
    return values;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} IST`;
}

function getBackupFilename() {
  const stamp = formatIstTimestamp(new Date())
    .replace(" IST", "")
    .replaceAll(":", "-")
    .replace(" ", "_");
  return `draft-it-backup-${stamp}-IST.draftit`;
}

function downloadDraftItBackup(reason = "manual") {
  const blob = new Blob([JSON.stringify(getDraftItBackupPayload(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getBackupFilename();
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  backupStatus.textContent = reason === "auto"
    ? `Auto backup downloaded ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Backup downloaded";
}

function normalizeImportedProjects(importedProjects) {
  if (!Array.isArray(importedProjects)) return [];
  return importedProjects
    .filter((project) => project && typeof project === "object")
    .map((project) => ensureProjectCollections({
      id: project.id || crypto.randomUUID(),
      title: project.title || "Untitled Project",
      author: project.author || "",
      cards: Array.isArray(project.cards) ? project.cards : [],
      characters: Array.isArray(project.characters) ? project.characters : [],
      characterTree: project.characterTree && typeof project.characterTree === "object"
        ? project.characterTree
        : { nodes: [], links: [] },
      screenplay: project.screenplay || "",
      createdAt: project.createdAt || new Date().toISOString(),
    }));
}

function restoreDraftItBackup(payload) {
  const importedProjects = normalizeImportedProjects(payload?.projects || payload);
  if (!importedProjects.length) {
    alert("This .draftit file does not contain any projects.");
    return;
  }

  const shouldRestore = confirm(`Import ${importedProjects.length} project${importedProjects.length === 1 ? "" : "s"} from this .draftit file? This will replace the projects currently in this browser.`);
  if (!shouldRestore) return;

  projects = importedProjects;
  activeProjectId = importedProjects.some((project) => project.id === payload?.activeProjectId)
    ? payload.activeProjectId
    : importedProjects[0].id;
  cards = getActiveProject()?.cards || [];
  activeScriptCardId = cards[0]?.id || null;
  selectedExportCardIds = new Set(cards.map((card) => card.id));
  exportSelectionTouched = false;
  saveProjects();
  renderProjects();
  render();
  setLayer("projects");
  backupStatus.textContent = "Backup imported";
}

function importDraftItBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      restoreDraftItBackup(JSON.parse(reader.result));
    } catch {
      alert("Could not read this .draftit file. Please choose a valid Draft It backup.");
    } finally {
      importBackupInput.value = "";
    }
  };
  reader.readAsText(file);
}

function setAutoBackup(enabled) {
  localStorage.setItem(autoBackupStorageKey, enabled ? "true" : "false");
  autoBackupToggle.checked = enabled;
  clearInterval(autoBackupTimer);
  autoBackupTimer = null;

  if (!enabled) {
    backupStatus.textContent = "Backups are off";
    return;
  }

  backupStatus.textContent = "Auto backup is on";
  autoBackupTimer = setInterval(() => downloadDraftItBackup("auto"), backupIntervalMs);
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
  const projectOnlyLayers = new Set(["cards", "screenplay", "tree"]);
  const nextLayer = projectOnlyLayers.has(layer) && !getActiveProject() ? "projects" : layer;
  localStorage.setItem(activeLayerStorageKey, nextLayer);
  document.body.dataset.layer = nextLayer;
  closeMobilePanels();
  hideCardMenu();
  closeSceneModal();
  closeCharactersModal();
  closeExportModal();
  if (nextLayer === "projects") renderProjects();
  if (nextLayer === "screenplay") renderScreenplay();
  if (nextLayer === "tree") renderCharacterTree();
}

function setActiveProject(id, layer = "cards") {
  activeProjectId = id;
  const project = getActiveProject();
  cards = project?.cards || [];
  activeScriptCardId = cards[0]?.id || null;
  activeCharacterId = project?.characters?.[0]?.id || null;
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
        <button class="zoom-button" type="button" data-open-characters="${project.id}">Characters</button>
        <button class="zoom-button" type="button" data-open-script="${project.id}">Script</button>
      </div>
    `;
    item.querySelector("h2").textContent = project.title;
    item.querySelector(".project-meta").textContent =
      `${project.author ? `by ${project.author} · ` : ""}${project.cards.length} ${project.cards.length === 1 ? "card" : "cards"} · ${project.characters.length} ${project.characters.length === 1 ? "character" : "characters"}`;
    projectList.append(item);
  });
}

function createProject(event) {
  event.preventDefault();
  const title = projectTitleInput.value.trim();
  const author = projectAuthorInput.value.trim();
  if (!title || !author) return;

  const project = {
    id: crypto.randomUUID(),
    title,
    author,
    cards: [],
    characters: [],
    characterTree: { nodes: [], links: [] },
    screenplay: "",
    createdAt: new Date().toISOString(),
  };
  projects.unshift(project);
  projectTitleInput.value = "";
  projectAuthorInput.value = "";
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

function openExportModal() {
  const project = getActiveProject();
  if (!project) return;

  if (!project.author) {
    const author = prompt("Author name for the title page:");
    if (author === null) return;
    project.author = author.trim();
    saveProjects();
    renderProjects();
  }

  saveScreenplay();
  const selectedCards = project.cards.filter((card) => selectedExportCardIds.has(card.id));
  if (!selectedCards.length) {
    alert("Select at least one card to export.");
    return;
  }

  renderExportCharacterOptions(project);
  exportModal.hidden = false;
}

function closeExportModal() {
  exportModal.hidden = true;
}

function renderExportCharacterOptions(project) {
  exportCharacterList.innerHTML = "";
  const hasCharacters = project.characters.length > 0;
  exportIncludeCharacters.checked = hasCharacters;
  exportIncludeCharacters.disabled = !hasCharacters;
  exportCharacterList.hidden = false;

  if (!hasCharacters) {
    exportCharacterList.innerHTML = "<p class=\"export-empty\">No characters created yet.</p>";
    return;
  }

  project.characters.forEach((character) => {
    const label = document.createElement("label");
    label.className = "export-character-option";
    label.innerHTML = `
      <input type="checkbox" value="${character.id}" checked />
      <span>
        <strong></strong>
        <small></small>
      </span>
    `;
    label.querySelector("strong").textContent = character.name;
    label.querySelector("small").textContent = `${character.gender || "OTHER"} · ${character.shade || "GRAY"} · ${character.screenTime || "MEDIUM"}`;
    exportCharacterList.append(label);
  });
}

function exportFromOptions() {
  const characterIds = exportIncludeCharacters.checked
    ? Array.from(exportCharacterList.querySelectorAll("input:checked")).map((input) => input.value)
    : [];
  exportCurrentProject(characterIds);
}

function exportCurrentProject(characterIds = []) {
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
  const author = escapeHtml(project.author || "");
  const selectedCharacters = project.characters.filter((character) => characterIds.includes(character.id));
  const titlePage = `
    <section class="title-page">
      <div>
        <h1>${title}</h1>
        ${author ? `<p>Written by</p><h2>${author}</h2>` : ""}
      </div>
    </section>
  `;
  const characterPages = selectedCharacters.length
    ? `
      <section class="characters-print">
        <h1>Characters</h1>
        ${selectedCharacters.map((character) => `
          <article class="print-character">
            <header>
              <h2>${escapeHtml(character.name)}</h2>
              <p>${escapeHtml(character.gender || "OTHER")} · ${escapeHtml(character.shade || "GRAY")} · ${escapeHtml(character.screenTime || "MEDIUM")}</p>
            </header>
            <dl>
              <dt>Biggest desire/goal</dt>
              <dd>${escapeHtml(character.goal || "")}</dd>
              <dt>Biggest fear</dt>
              <dd>${escapeHtml(character.fear || "")}</dd>
              <dt>Lie he/she believes</dt>
              <dd>${escapeHtml(character.lie || "")}</dd>
            </dl>
          </article>
        `).join("")}
      </section>
    `
    : "";
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
          .title-page {
            display: grid;
            align-items: center;
            min-height: 9.2in;
            break-after: page;
            text-align: center;
          }
          .title-page h1 {
            margin: 0 0 42px;
            font-size: 32px;
            text-transform: uppercase;
          }
          .title-page p {
            margin: 0 0 8px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            text-transform: uppercase;
          }
          .title-page h2 {
            font-size: 18px;
          }
          .characters-print {
            break-after: page;
          }
          .characters-print h1 {
            margin-bottom: 22px;
          }
          .print-character {
            break-inside: avoid;
            margin-bottom: 20px;
            border-top: 1px solid #bbb;
            padding-top: 12px;
            font-family: Arial, sans-serif;
          }
          .print-character header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          .print-character header p {
            margin: 0;
            color: #666;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .print-character dl {
            display: grid;
            gap: 4px;
            margin: 10px 0 0;
          }
          .print-character dt {
            color: #666;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .print-character dd {
            margin: 0 0 8px;
            line-height: 1.35;
            white-space: pre-wrap;
          }
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
        ${titlePage}
        ${characterPages}
        ${body}
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
  closeExportModal();
}

function getCurrentLineRange(textarea) {
  const value = textarea.value;
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", textarea.selectionEnd);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  return { lineStart, lineEnd, line: value.slice(lineStart, lineEnd) };
}

function handleScreenplayEnter(event) {
  if (event.key !== "Enter" || event.shiftKey || screenplayInput.disabled) return;

  const { line } = getCurrentLineRange(screenplayInput);
  const className = getScreenplayLineClass(line);
  const nextLinePrefixes = {
    character: "          ",
    "scene-heading": "",
  };

  if (!Object.hasOwn(nextLinePrefixes, className)) return;

  event.preventDefault();
  const prefix = nextLinePrefixes[className];
  const value = screenplayInput.value;
  const start = screenplayInput.selectionStart;
  const end = screenplayInput.selectionEnd;
  const insertion = `\n${prefix}`;
  screenplayInput.value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
  const cursor = start + insertion.length;
  screenplayInput.setSelectionRange(cursor, cursor);
  saveScreenplay();
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

function openCharactersModal() {
  const project = getActiveProject();
  if (!project) {
    setLayer("projects");
    return;
  }

  activeCharacterId = project.characters.some((character) => character.id === activeCharacterId)
    ? activeCharacterId
    : project.characters[0]?.id || null;
  charactersProjectTitle.textContent = `${project.title} characters`;
  charactersModal.hidden = false;
  closeCharacterForm();
  renderCharacters();
}

function closeCharactersModal() {
  charactersModal.hidden = true;
  closeCharacterForm();
}

function openCharacterForm() {
  characterForm.hidden = false;
  charactersModal.classList.add("is-creating-character");
  requestAnimationFrame(() => characterNameInput.focus());
}

function closeCharacterForm() {
  characterForm.hidden = true;
  charactersModal.classList.remove("is-creating-character");
}

function renderCharacters() {
  const project = getActiveProject();
  if (!project) return;

  characterStrip.innerHTML = "";
  characterDetail.innerHTML = "";
  characterSubmitButton.textContent = "Create character";

  if (!project.characters.length) {
    characterStrip.innerHTML = "<p class=\"character-empty\">No characters yet.</p>";
    characterDetail.innerHTML = "<p class=\"character-empty\">Tap + to create a character. Their brief will appear here after saving.</p>";
    return;
  }

  project.characters.forEach((character) => {
    const shade = character.shade || "GRAY";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `character-thumb shade-${shade.toLowerCase()}`;
    button.classList.toggle("is-active", character.id === activeCharacterId);
    button.dataset.characterId = character.id;
    button.innerHTML = `
      <strong></strong>
      <span></span>
    `;
    button.querySelector("strong").textContent = character.name;
    button.querySelector("span").textContent = `${character.gender || "OTHER"} · ${character.screenTime || "MEDIUM"}`;
    characterStrip.append(button);
  });

  const selected = project.characters.find((character) => character.id === activeCharacterId) || project.characters[0];
  if (!selected) return;
  activeCharacterId = selected.id;

  characterDetail.innerHTML = `
    <div class="character-detail-heading">
      <div>
        <p class="eyebrow">Selected character</p>
        <h3></h3>
      </div>
      <div class="character-badges">
        <span class="character-badge shade-${(selected.shade || "GRAY").toLowerCase()}"></span>
        <span class="character-badge"></span>
        <span class="character-badge"></span>
      </div>
    </div>
    <dl>
      <div>
        <dt>Biggest desire/goal</dt>
        <dd></dd>
      </div>
      <div>
        <dt>Biggest fear</dt>
        <dd></dd>
      </div>
      <div>
        <dt>Lie he/she believes</dt>
        <dd></dd>
      </div>
    </dl>
  `;
  characterDetail.querySelector("h3").textContent = selected.name;
  const badges = characterDetail.querySelectorAll(".character-badge");
  badges[0].textContent = selected.shade || "GRAY";
  badges[1].textContent = selected.gender || "OTHER";
  badges[2].textContent = selected.screenTime || "MEDIUM";
  const details = characterDetail.querySelectorAll("dd");
  details[0].textContent = selected.goal;
  details[1].textContent = selected.fear;
  details[2].textContent = selected.lie;
}

function getCharacterById(id) {
  return getActiveProject()?.characters.find((character) => character.id === id) || null;
}

function getTreeNodeLabel(node, index = 0, nodes = getActiveProject()?.characterTree.nodes || []) {
  const character = getCharacterById(node.characterId);
  if (!character) return `Node ${index + 1}`;
  const sameCharacterNodes = nodes.filter((item) => item.characterId === node.characterId);
  if (sameCharacterNodes.length < 2) return character.name;
  const instance = sameCharacterNodes.findIndex((item) => item.id === node.id) + 1;
  return `${character.name} node ${instance}`;
}

function openCharacterTree() {
  const project = getActiveProject();
  if (!project) {
    setLayer("projects");
    return;
  }
  closeCharactersModal();
  setLayer("tree");
}

function renderCharacterTree() {
  const project = getActiveProject();
  if (!project) {
    setLayer("projects");
    return;
  }

  treeProjectTitle.textContent = `${project.title} relationships`;
  treeSurface.querySelectorAll(".tree-node").forEach((node) => node.remove());
  treeLines.innerHTML = "";
  applyTreeView();
  renderTreeControls(project);

  project.characterTree.nodes.forEach((node, index) => {
    const character = project.characters.find((item) => item.id === node.characterId);
    const element = document.createElement("div");
    element.setAttribute("role", "group");
    element.tabIndex = 0;
    element.className = `tree-node shade-${(character?.shade || "GRAY").toLowerCase()}`;
    element.dataset.treeNodeId = node.id;
    element.style.left = `${node.x}px`;
    element.style.top = `${node.y}px`;
    element.innerHTML = `
      <span class="tree-node-copy">
        <strong></strong>
        <span></span>
      </span>
      <span class="tree-node-actions">
        <button data-tree-action="remove" type="button" title="Remove this node only" aria-label="Remove this node only">-</button>
      </span>
    `;
    element.querySelector(".tree-node-copy strong").textContent = character?.name || `Node ${index + 1}`;
    element.querySelector(".tree-node-copy > span").textContent = character
      ? `${character.gender || "OTHER"} · ${character.shade || "GRAY"} · ${character.screenTime || "MEDIUM"}`
      : "Missing character";
    treeSurface.append(element);
  });

  renderTreeLines(project);
  treeEmpty.hidden = project.characterTree.nodes.length > 0;
}

function renderTreeControls(project) {
  treeCharacterSelect.innerHTML = "";
  project.characters.forEach((character) => {
    const option = document.createElement("option");
    option.value = character.id;
    option.textContent = character.name;
    treeCharacterSelect.append(option);
  });

  [treeRelationFrom, treeRelationTo].forEach((select) => {
    select.innerHTML = "";
    project.characterTree.nodes.forEach((node, index) => {
      const option = document.createElement("option");
      option.value = node.id;
      option.textContent = getTreeNodeLabel(node, index, project.characterTree.nodes);
      select.append(option);
    });
  });

  treeAddNode.disabled = project.characters.length === 0;
  treeAddRelation.disabled = project.characterTree.nodes.length < 2;
}

function renderTreeLines(project) {
  treeLines.setAttribute("width", treeSurface.offsetWidth || 4000);
  treeLines.setAttribute("height", treeSurface.offsetHeight || 3000);
  treeLines.innerHTML = `
    <defs>
      <marker id="tree-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
        <path d="M2,2 L10,6 L2,10 Z"></path>
      </marker>
    </defs>
  `;

  project.characterTree.links.forEach((link) => {
    const from = project.characterTree.nodes.find((node) => node.id === link.fromNodeId);
    const to = project.characterTree.nodes.find((node) => node.id === link.toNodeId);
    if (!from || !to) return;

    const x1 = from.x + 90;
    const y1 = from.y + 36;
    const x2 = to.x + 90;
    const y2 = to.y + 36;
    const lineLength = Math.hypot(x2 - x1, y2 - y1) || 1;
    const targetOffset = Math.min(96, lineLength / 3);
    const endX = x2 - ((x2 - x1) / lineLength) * targetOffset;
    const endY = y2 - ((y2 - y1) / lineLength) * targetOffset;
    const midX = (x1 + endX) / 2;
    const midY = (y1 + endY) / 2;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.dataset.treeLinkId = link.id;
    group.innerHTML = `
      <line x1="${x1}" y1="${y1}" x2="${endX}" y2="${endY}" marker-end="url(#tree-arrow)"></line>
      <text x="${midX}" y="${midY - 8}"></text>
      <g class="tree-link-remove" data-tree-link-remove="${link.id}" transform="translate(${midX + 72} ${midY - 24})">
        <title>Remove this relationship line</title>
        <circle cx="0" cy="0" r="11"></circle>
        <text x="0" y="5" text-anchor="middle">-</text>
      </g>
    `;
    group.querySelector("text").textContent = link.text || "relationship";
    treeLines.append(group);
  });
}

function addTreeNode() {
  const project = getActiveProject();
  const characterId = treeCharacterSelect.value;
  if (!project || !characterId) return;

  const count = project.characterTree.nodes.length;
  project.characterTree.nodes.push({
    id: crypto.randomUUID(),
    characterId,
    x: 160 + (count % 5) * 220,
    y: 140 + Math.floor(count / 5) * 150,
  });
  saveProjects();
  renderCharacterTree();
}

function addTreeRelation() {
  const project = getActiveProject();
  if (!project) return;
  const fromNodeId = treeRelationFrom.value;
  const toNodeId = treeRelationTo.value;
  const text = treeRelationInput.value.trim();
  if (!fromNodeId || !toNodeId || fromNodeId === toNodeId || !text) return;
  const fromNode = project.characterTree.nodes.find((node) => node.id === fromNodeId);
  const toNode = project.characterTree.nodes.find((node) => node.id === toNodeId);
  if (!fromNode || !toNode) return;
  const duplicate = project.characterTree.links.some((link) => (
    (link.fromNodeId === fromNode.id && link.toNodeId === toNode.id) ||
    (link.fromNodeId === toNode.id && link.toNodeId === fromNode.id)
  ));
  if (duplicate) {
    alert("These two nodes are already connected. Click the relationship text to edit it.");
    return;
  }

  project.characterTree.links.push({
    id: crypto.randomUUID(),
    fromNodeId,
    toNodeId,
    text,
  });
  treeRelationInput.value = "";
  saveProjects();
  renderCharacterTree();
}

function deleteTreeNode(id) {
  const project = getActiveProject();
  if (!project) return;
  const node = project.characterTree.nodes.find((item) => item.id === id);
  if (!node) return;
  const character = getCharacterById(node.characterId);
  const shouldRemove = confirm(`Remove this "${character?.name || "character"}" node from the tree only? The character will stay saved, and connected relationship lines for this node will be removed.`);
  if (!shouldRemove) return;

  project.characterTree.nodes = project.characterTree.nodes.filter((item) => item.id !== id);
  project.characterTree.links = project.characterTree.links.filter((link) => link.fromNodeId !== id && link.toNodeId !== id);
  saveProjects();
  renderCharacterTree();
}

function beginTreeNodeDrag(event) {
  const node = event.target.closest(".tree-node");
  if (!node) return;
  if (event.target.closest("[data-tree-action]")) return;
  const project = getActiveProject();
  const data = project?.characterTree.nodes.find((item) => item.id === node.dataset.treeNodeId);
  if (!data) return;

  const treePoint = screenToTree(event.clientX, event.clientY);
  activeTreeDrag = {
    id: data.id,
    element: node,
    offsetX: treePoint.x - data.x,
    offsetY: treePoint.y - data.y,
  };
  node.classList.add("is-dragging");
  treeBoard.setPointerCapture(event.pointerId);
}

function handleTreeNodeAction(event) {
  const action = event.target.closest("[data-tree-action]");
  const node = event.target.closest(".tree-node");
  if (!action || !node) return;
  if (action.dataset.treeAction === "remove") deleteTreeNode(node.dataset.treeNodeId);
}

function moveTreeNode(event) {
  if (!activeTreeDrag) return;
  const project = getActiveProject();
  const node = project?.characterTree.nodes.find((item) => item.id === activeTreeDrag.id);
  if (!node) return;

  const treePoint = screenToTree(event.clientX, event.clientY);
  node.x = clamp(treePoint.x - activeTreeDrag.offsetX, 20, 3800);
  node.y = clamp(treePoint.y - activeTreeDrag.offsetY, 20, 2800);
  activeTreeDrag.element.style.left = `${node.x}px`;
  activeTreeDrag.element.style.top = `${node.y}px`;
  treeLines.innerHTML = "";
  renderTreeLines(project);
}

function endTreeNodeDrag() {
  if (!activeTreeDrag) return;
  activeTreeDrag.element.classList.remove("is-dragging");
  activeTreeDrag = null;
  saveProjects();
}

function editTreeRelation(event) {
  const remove = event.target.closest("[data-tree-link-remove]");
  if (remove) {
    deleteTreeRelation(remove.dataset.treeLinkRemove);
    return;
  }

  const label = event.target.closest("[data-tree-link-id]");
  if (!label || event.target.tagName.toLowerCase() !== "text") return;
  const project = getActiveProject();
  const link = project?.characterTree.links.find((item) => item.id === label.dataset.treeLinkId);
  if (!link) return;

  const next = prompt("Relationship between these characters:", link.text);
  if (next === null) return;
  link.text = next.trim() || link.text;
  saveProjects();
  renderCharacterTree();
}

function deleteTreeRelation(id) {
  const project = getActiveProject();
  if (!project) return;
  const link = project.characterTree.links.find((item) => item.id === id);
  if (!link) return;
  const shouldRemove = confirm(`Remove the "${link.text || "relationship"}" line? The character nodes will stay on the tree.`);
  if (!shouldRemove) return;

  project.characterTree.links = project.characterTree.links.filter((item) => item.id !== id);
  saveProjects();
  renderCharacterTree();
}

function createCharacter(event) {
  event.preventDefault();
  const project = getActiveProject();
  if (!project) return;

  const name = characterNameInput.value.trim();
  const goal = characterGoalInput.value.trim();
  const fear = characterFearInput.value.trim();
  const lie = characterLieInput.value.trim();
  if (!name || !goal || !fear || !lie) return;

  const character = {
    id: crypto.randomUUID(),
    name,
    goal,
    fear,
    lie,
    gender: characterGenderInput.value,
    shade: characterShadeInput.value,
    screenTime: characterScreenTimeInput.value,
    createdAt: new Date().toISOString(),
  };

  project.characters.push(character);
  activeCharacterId = character.id;
  characterForm.reset();
  closeCharacterForm();
  saveProjects();
  renderCharacters();
  renderProjects();
  characterNameInput.focus();
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

function applyTreeView() {
  treeSurface.style.transform = `translate(${treeView.x}px, ${treeView.y}px) scale(${treeView.scale})`;
  treeZoomLevel.textContent = `${Math.round(treeView.scale * 100)}%`;
}

function screenToBoard(clientX, clientY) {
  const rect = board.getBoundingClientRect();
  return {
    x: (clientX - rect.left - boardView.x) / boardView.scale,
    y: (clientY - rect.top - boardView.y) / boardView.scale,
  };
}

function screenToTree(clientX, clientY) {
  const rect = treeBoard.getBoundingClientRect();
  return {
    x: (clientX - rect.left - treeView.x) / treeView.scale,
    y: (clientY - rect.top - treeView.y) / treeView.scale,
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

function zoomTree(nextScale, originClientX = treeBoard.clientWidth / 2, originClientY = treeBoard.clientHeight / 2) {
  const rect = treeBoard.getBoundingClientRect();
  const originX = originClientX - rect.left;
  const originY = originClientY - rect.top;
  const oldScale = treeView.scale;
  const scale = clamp(nextScale, minZoom, maxZoom);
  const worldX = (originX - treeView.x) / oldScale;
  const worldY = (originY - treeView.y) / oldScale;

  treeView.scale = scale;
  treeView.x = originX - worldX * scale;
  treeView.y = originY - worldY * scale;
  applyTreeView();
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

function handleTreeWheel(event) {
  event.preventDefault();

  if (event.ctrlKey || event.metaKey) {
    const zoomFactor = Math.exp(-event.deltaY * 0.01);
    zoomTree(treeView.scale * zoomFactor, event.clientX, event.clientY);
    return;
  }

  treeView.x -= event.deltaX;
  treeView.y -= event.deltaY;
  applyTreeView();
}

function handlePageZoomKeys(event) {
  if (!event.ctrlKey && !event.metaKey) return;
  const isTreeLayer = document.body.dataset.layer === "tree";

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    if (isTreeLayer) zoomTree(treeView.scale * 1.15);
    else zoomBoard(boardView.scale * 1.15);
  }

  if (event.key === "-") {
    event.preventDefault();
    if (isTreeLayer) zoomTree(treeView.scale / 1.15);
    else zoomBoard(boardView.scale / 1.15);
  }

  if (event.key === "0") {
    event.preventDefault();
    if (isTreeLayer) {
      treeView = getDefaultBoardView();
      applyTreeView();
    } else {
      boardView = getDefaultBoardView();
      applyBoardView();
    }
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
manualBackup.addEventListener("click", () => downloadDraftItBackup("manual"));
importBackupInput.addEventListener("change", importDraftItBackup);
autoBackupToggle.addEventListener("change", () => setAutoBackup(autoBackupToggle.checked));
projectList.addEventListener("click", (event) => {
  const cardsButton = event.target.closest("[data-open-project]");
  const charactersButton = event.target.closest("[data-open-characters]");
  const scriptButton = event.target.closest("[data-open-script]");
  if (cardsButton) setActiveProject(cardsButton.dataset.openProject, "cards");
  if (charactersButton) {
    setActiveProject(charactersButton.dataset.openCharacters, "cards");
    openCharactersModal();
  }
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
treeZoomOut.addEventListener("click", () => zoomTree(treeView.scale / 1.2));
treeZoomIn.addEventListener("click", () => zoomTree(treeView.scale * 1.2));
treeZoomReset.addEventListener("click", () => {
  treeView = getDefaultBoardView();
  applyTreeView();
});
showProjects.addEventListener("click", () => setLayer("projects"));
showCharacters.addEventListener("click", (event) => {
  event.preventDefault();
  openCharactersModal();
});
showScreenplay.addEventListener("click", () => setLayer("screenplay"));
scriptToProjects.addEventListener("click", () => setLayer("projects"));
scriptToCards.addEventListener("click", () => setLayer("cards"));
scriptToCharacters.addEventListener("click", (event) => {
  event.preventDefault();
  openCharactersModal();
});
treeToProjects.addEventListener("click", () => setLayer("projects"));
treeToCards.addEventListener("click", () => setLayer("cards"));
treeToScript.addEventListener("click", () => setLayer("screenplay"));
treeOpenCharacters.addEventListener("click", openCharactersModal);
treeAddNode.addEventListener("click", addTreeNode);
treeAddRelation.addEventListener("click", addTreeRelation);
treeSurface.addEventListener("click", handleTreeNodeAction);
treeBoard.addEventListener("pointerdown", beginTreeNodeDrag);
treeBoard.addEventListener("pointermove", moveTreeNode);
treeBoard.addEventListener("pointerup", endTreeNodeDrag);
treeBoard.addEventListener("pointercancel", endTreeNodeDrag);
treeBoard.addEventListener("wheel", handleTreeWheel, { passive: false });
treeLines.addEventListener("click", editTreeRelation);
buildScript.addEventListener("click", seedActiveCardScreenplay);
exportScript.addEventListener("click", openExportModal);
screenplayInput.addEventListener("input", saveScreenplay);
screenplayInput.addEventListener("keydown", handleScreenplayEnter);
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
characterForm.addEventListener("submit", createCharacter);
characterAddButton.addEventListener("click", openCharacterForm);
characterFormClose.addEventListener("click", closeCharacterForm);
characterTreeButton.addEventListener("click", openCharacterTree);
characterStrip.addEventListener("click", (event) => {
  const thumb = event.target.closest("[data-character-id]");
  if (!thumb) return;
  activeCharacterId = thumb.dataset.characterId;
  renderCharacters();
});
charactersModalClose.addEventListener("click", closeCharactersModal);
charactersModal.addEventListener("click", (event) => {
  if (event.target === charactersModal) closeCharactersModal();
});
exportIncludeCharacters.addEventListener("change", () => {
  exportCharacterList.toggleAttribute("hidden", !exportIncludeCharacters.checked);
});
exportConfirm.addEventListener("click", exportFromOptions);
exportCancel.addEventListener("click", closeExportModal);
exportModalClose.addEventListener("click", closeExportModal);
exportModal.addEventListener("click", (event) => {
  if (event.target === exportModal) closeExportModal();
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
setAutoBackup(localStorage.getItem(autoBackupStorageKey) === "true");
renderProjects();
if (activeProjectId && getActiveProject()) {
  render();
  const savedLayer = localStorage.getItem(activeLayerStorageKey);
  setLayer(["cards", "screenplay", "tree"].includes(savedLayer) ? savedLayer : "projects");
} else {
  setLayer("projects");
}
