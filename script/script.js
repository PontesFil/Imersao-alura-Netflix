const profileCards = document.querySelectorAll(".profile-card");
const manageButton = document.getElementById("manageProfiles");
const selectionToast = document.getElementById("selectionToast");
const selectedProfileName = document.getElementById("selectedProfileName");
const selectedProfileMessage = document.getElementById("selectedProfileMessage");
const themeToggle = document.getElementById("themeToggle");
const screenTransition = document.getElementById("screenTransition");

let toastTimer;

function savePreference(key, value) {
  localStorage.setItem(key, value);
}

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);
  document.body.dataset.theme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
  }

  savePreference("netlipe:theme", isLight ? "light" : "dark");
}

function hideToastAfter(delay) {
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    selectionToast.hidden = true;
  }, delay);
}

function showToast(title, message, delay = 2600) {
  selectedProfileName.textContent = title;
  selectedProfileMessage.textContent = message;
  selectionToast.hidden = false;
  hideToastAfter(delay);
}

function selectProfile(card, options = {}) {
  const { silent = false, redirect = false } = options;

  profileCards.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });

  card.classList.add("is-active");
  card.setAttribute("aria-pressed", "true");
  savePreference("netlipe:selected-profile", card.dataset.profile);

  if (!silent) {
    showToast(card.dataset.profile, "Entrando no perfil em uma interface sem backend.");
  }

  if (redirect) {
    screenTransition?.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-transitioning");
    window.setTimeout(() => {
      window.location.href = "./catalog.html";
    }, 760);
  }
}

profileCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectProfile(card, { redirect: true });
  });
});

manageButton?.addEventListener("click", () => {
  showToast("Gerenciar perfis", "Aqui você poderia abrir uma tela futura de edição, também no frontend.", 2800);
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(nextTheme);
});

const savedProfile = localStorage.getItem("netlipe:selected-profile");
const savedTheme = localStorage.getItem("netlipe:theme") || "dark";
const initialCard = Array.from(profileCards).find((card) => card.dataset.profile === savedProfile) || profileCards[0];

applyTheme(savedTheme);

if (initialCard) {
  selectProfile(initialCard, { silent: true });
}
