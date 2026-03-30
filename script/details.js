const detailsTitle = document.getElementById("detailsTitle");
const detailsMeta = document.getElementById("detailsMeta");
const detailsDescription = document.getElementById("detailsDescription");
const detailsRowTitle = document.getElementById("detailsRowTitle");
const detailsTags = document.getElementById("detailsTags");
const detailsHero = document.getElementById("detailsHero");
const watchNow = document.getElementById("watchNow");
const saveTitle = document.getElementById("saveTitle");
const themeToggle = document.getElementById("themeToggle");
const detailsLoader = document.getElementById("detailsLoader");
const detailsContent = document.getElementById("detailsContent");

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
  }

  localStorage.setItem("netlipe:theme", isLight ? "light" : "dark");
}

function showLoader(message = "Abrindo detalhes...") {
  const label = detailsLoader?.querySelector(".page-loader-text");
  if (label) {
    label.textContent = message;
  }

  document.body.classList.add("is-loading");
  detailsContent?.setAttribute("aria-busy", "true");
}

function hideLoader() {
  document.body.classList.remove("is-loading");
  detailsContent?.setAttribute("aria-busy", "false");
}

function renderMovie(movie) {
  detailsRowTitle.textContent = movie.rowTitle || "Destaque";
  detailsTitle.textContent = movie.title;
  detailsMeta.textContent = `${movie.year} | ${movie.genre} | ${movie.runtime} | ${movie.rating}`;
  detailsDescription.textContent = movie.description;
  detailsHero.style.setProperty("--hero-accent", movie.accent);
  detailsHero.style.setProperty("--hero-secondary", movie.secondary);
  detailsTags.innerHTML = [
    `<span>Perfil ${movie.profile}</span>`,
    `<span>${movie.genre}</span>`,
    `<span>${movie.rating}</span>`
  ].join("");

  watchNow.onclick = () => {
    alert(`Reproduzindo ${movie.title} no perfil ${movie.profile}.`);
  };

  saveTitle.onclick = () => {
    alert(`"${movie.title}" salvo na lista de ${movie.profile}.`);
  };
}

const selectedMovieRaw = localStorage.getItem("netlipe:selected-movie");
const savedTheme = localStorage.getItem("netlipe:theme") || "dark";

applyTheme(savedTheme);
showLoader();

if (!selectedMovieRaw) {
  window.location.href = "./catalog.html";
} else {
  window.setTimeout(() => {
    renderMovie(JSON.parse(selectedMovieRaw));
    hideLoader();
  }, 420);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(nextTheme);
});
