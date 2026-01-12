class Heroi {
  constructor(nome, idade, tipoKey) {
    this.nome = nome;
    this.idade = idade;
    this.tipoKey = tipoKey;
  }

  static TIPOS = {
    guerreiro: { label: "Guerreiro", emoji: "🛡️", ataque: "Espada", especial: "Golpe Colossal" },
    mago:      { label: "Mago",      emoji: "🧙",  ataque: "Magia",  especial: "Bola de Fogo" },
    monge:     { label: "Monge",     emoji: "🥋",  ataque: "Artes Marciais", especial: "Punho do Dragão" },
    ninja:     { label: "Ninja",     emoji: "🥷",  ataque: "Shuriken", especial: "Sombra Cortante" },
  };

  get tipo() {
    return Heroi.TIPOS[this.tipoKey];
  }

  atacar() {
    return `O ${this.tipo.label} ${this.nome} atacou usando ${this.tipo.ataque}!`;
  }

  especial() {
    return `✨ ${this.nome} usou ${this.tipo.especial}!`;
  }
}

/* ===== DOM ===== */
const $ = (q) => document.querySelector(q);

const openCreate = $("#openCreate");
const resetBtn = $("#resetBtn");

const modalBackdrop = $("#modalBackdrop");
const createModal = $("#createModal");
const closeModal = $("#closeModal");
const cancelBtn = $("#cancelBtn");

const heroForm = $("#heroForm");
const nomeEl = $("#nome");
const idadeEl = $("#idade");
const tipoEl = $("#tipo");
const formMsg = $("#formMsg");

const attackBtn = $("#attackBtn");
const specialBtn = $("#specialBtn");
const screen = $("#screen");

const character = $("#character");
const charFace = $("#charFace");
const charBody = $("#charBody");

const heroLabel = $("#heroLabel");
const heroTypeLabel = $("#heroTypeLabel");

const heroName = $("#heroName");
const heroAge = $("#heroAge");
const heroType = $("#heroType");

const previewFace = $("#previewFace");
const previewBody = $("#previewBody");
const previewType = $("#previewType");

let heroi = null;

/* ===== Modal controls ===== */
function openModal() {
  document.body.classList.add("modal-open");
  createModal.setAttribute("aria-hidden", "false");
  modalBackdrop.setAttribute("aria-hidden", "false");

  // foco no primeiro campo
  setTimeout(() => nomeEl.focus(), 0);
}

function closeModalFn() {
  document.body.classList.remove("modal-open");
  createModal.setAttribute("aria-hidden", "true");
  modalBackdrop.setAttribute("aria-hidden", "true");
  setMessage("", "");
}

function setMessage(text, kind = "") {
  formMsg.textContent = text;
  formMsg.className = `msg ${kind}`.trim();
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

/* ===== Character skins ===== */
const characterImgStage = document.getElementById("characterImgStage");
const characterImgPreview = document.getElementById("characterImgPreview");

/**
 * ✅ Use SEMPRE o mesmo padrão de pasta: "assets/img/"
 * Linux/servidor quebra com "Assets" vs "assets".
 */
const AVATARS = {
  guerreiro: "assets/img/guerreiro.png",
  mago:      "assets/img/mago.png",
  monge:     "assets/img/monge.png",
  ninja:     "assets/img/ninja.png"
};

function resolvePath(relativePath) {
  // resolve baseado na URL atual do index.html
  return new URL(relativePath, window.location.href).toString();
}

function setImg(imgEl, relativePath) {
  if (!imgEl) return;

  const src = resolvePath(relativePath);

  // Debug: mostra exatamente o src final que o browser vai tentar carregar
  console.log("[IMG]", imgEl.id, "=>", src);

  imgEl.style.opacity = 0;

  // onerror para você ver quando o caminho está errado
  imgEl.onerror = () => {
    console.error("❌ Não carregou:", src);
    imgEl.style.opacity = 1;
  };

  imgEl.onload = () => {
    console.log("✅ Carregou:", src);
    imgEl.style.opacity = 1;
  };

  // troca a imagem
  imgEl.src = src;
}

function updateCharacterImage(tipoKey) {
  const path = AVATARS[tipoKey];
  if (!path) return;

  setImg(characterImgStage, path);
  setImg(characterImgPreview, path);
}

function updateCharacterImage(tipoKey){
  const src = AVATARS[tipoKey];
  if (!src) return;

  // Atualiza a imagem do STAGE (tela principal)
  if (characterImgStage) {
    characterImgStage.style.opacity = 0;
    requestAnimationFrame(() => {
      characterImgStage.src = src;
      characterImgStage.style.opacity = 1;
    });
  }

  // Atualiza a imagem do PREVIEW (modal)
  if (characterImgPreview) {
    characterImgPreview.style.opacity = 0;
    requestAnimationFrame(() => {
      characterImgPreview.src = src;
      characterImgPreview.style.opacity = 1;
    });
  }
}


function applySkin(tipoKey) {
  character.classList.remove("skin-guerreiro","skin-mago","skin-monge","skin-ninja");
  if (tipoKey) character.classList.add(`skin-${tipoKey}`);

  const tipo = Heroi.TIPOS[tipoKey];
  if (!tipo) {
    charFace.textContent = "?";
    return;
  }
  charFace.textContent = tipo.emoji;
}

function applyPreview(tipoKey) {
  const tipo = Heroi.TIPOS[tipoKey];
  if (!tipo) {
    previewFace.textContent = "?";
    previewType.textContent = "—";
    previewBody.style.background = "rgba(255,255,255,.06)";
    return;
  }
  previewFace.textContent = tipo.emoji;
  previewType.textContent = `${tipo.label} • Ataque: ${tipo.ataque}`;

  // mini-skin no preview
  const map = {
    guerreiro: "linear-gradient(180deg, rgba(180,200,255,.16), rgba(255,255,255,.05))",
    mago: "linear-gradient(180deg, rgba(170,120,255,.18), rgba(255,255,255,.05))",
    monge: "linear-gradient(180deg, rgba(255,185,90,.18), rgba(255,255,255,.05))",
    ninja: "linear-gradient(180deg, rgba(70,90,120,.22), rgba(255,255,255,.05))",
  };
  previewBody.style.background = map[tipoKey] || "rgba(255,255,255,.06)";
}

/* ===== Render hero ===== */
function renderHero() {
  if (!heroi) return;

  heroName.textContent = heroi.nome;
  heroAge.textContent = heroi.idade;
  heroType.textContent = heroi.tipo.label;

  heroLabel.textContent = heroi.nome;
  heroTypeLabel.textContent = heroi.tipo.label;

  applySkin(heroi.tipoKey);

  attackBtn.disabled = false;
  specialBtn.disabled = false;
  resetBtn.disabled = false;

  screen.innerHTML = `<p>✅ Herói criado: <strong>${escapeHTML(heroi.nome)}</strong> (${escapeHTML(heroi.tipo.label)}).</p>
  <p class="muted">Clique em <strong>Atacar</strong> para ver a ação na tela.</p>`;
}

/* ===== Actions ===== */
function flashScreen() {
  screen.classList.remove("flash");
  void screen.offsetWidth;
  screen.classList.add("flash");
}

function hitCharacter() {
  character.classList.remove("hit");
  void character.offsetWidth;
  character.classList.add("hit");
}

attackBtn.addEventListener("click", () => {
  if (!heroi) return;
  const text = heroi.atacar();
  flashScreen();
  hitCharacter();
  screen.innerHTML = `<p>${escapeHTML(text)}</p><p class="muted">Dica: use o Especial também ✨</p>`;
});

specialBtn.addEventListener("click", () => {
  if (!heroi) return;
  const text = heroi.especial();
  flashScreen();
  hitCharacter();
  screen.innerHTML = `<p>${escapeHTML(text)}</p><p class="muted">🔥 Golpe especial executado com sucesso!</p>`;
});

resetBtn.addEventListener("click", () => {
  heroi = null;

  heroName.textContent = "—";
  heroAge.textContent = "—";
  heroType.textContent = "—";

  heroLabel.textContent = "Sem herói";
  heroTypeLabel.textContent = "—";

  applySkin(null);

  attackBtn.disabled = true;
  specialBtn.disabled = true;
  resetBtn.disabled = true;

  screen.innerHTML = `<p class="muted">Herói resetado. Abra o modal e crie outro.</p>`;
});

/* ===== Modal events ===== */
openCreate.addEventListener("click", () => {
  // se já existe herói, pré-preenche
  if (heroi) {
    nomeEl.value = heroi.nome;
    idadeEl.value = heroi.idade;
    tipoEl.value = heroi.tipoKey;
    applyPreview(heroi.tipoKey);
  } else {
    heroForm.reset();
    applyPreview(null);
  }
  openModal();
});

closeModal.addEventListener("click", closeModalFn);
cancelBtn.addEventListener("click", closeModalFn);
modalBackdrop.addEventListener("click", closeModalFn);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("modal-open")) {
    closeModalFn();
  }
});

/* Preview changes */
tipoEl.addEventListener("change", () => {
  const tipoKey = tipoEl.value;

  applyPreview(tipoKey);

  // 👉 AQUI, exatamente AQUI
  updateCharacterImage(tipoKey);
});

/* Submit */
heroForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = nomeEl.value.trim();
  const idade = Number(idadeEl.value);
  const tipoKey = tipoEl.value;

  if (!nome || !idade || !Heroi.TIPOS[tipoKey]) {
    setMessage("Preencha todos os campos corretamente.", "err");
    return;
  }

  heroi = new Heroi(nome, idade, tipoKey);

  renderHero();

  // 🔥 AQUI → troca automática da imagem do personagem
  updateCharacterImage(tipoKey);

  setMessage("Herói criado com sucesso!", "ok");
  closeModalFn();
});

/* Init */
applySkin(null);
applyPreview(null);
window.addEventListener("load", () => {
  setTimeout(() => openModal(), 2500);
});