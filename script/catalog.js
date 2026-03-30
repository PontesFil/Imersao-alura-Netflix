const catalogs = window.NETLIPE_CATALOGS || {};
const profileAvatar = document.getElementById("activeProfileAvatar");
const profileName = document.getElementById("activeProfileName");
const themeToggle = document.getElementById("themeToggle");
const heroBanner = document.getElementById("heroBanner");
const heroKicker = document.getElementById("heroKicker");
const heroTitle = document.getElementById("heroTitle");
const heroMeta = document.getElementById("heroMeta");
const heroDescription = document.getElementById("heroDescription");
const catalogRows = document.getElementById("catalogRows");
const playHero = document.getElementById("playHero");
const saveHero = document.getElementById("saveHero");
const catalogToast = document.getElementById("catalogToast");
const catalogToastTitle = document.getElementById("catalogToastTitle");
const catalogToastMessage = document.getElementById("catalogToastMessage");
const searchForm = document.getElementById("catalogSearchForm");
const searchInput = document.getElementById("catalogSearchInput");
const filterButtons = document.querySelectorAll(".filter-chip");
const pageLoader = document.getElementById("pageLoader");
const catalogContent = document.getElementById("catalogContent");

let toastTimer;
let currentProfile = null;
let currentQuery = "";
let currentFilter = "Todos";
let currentCatalog = null;

function savePreference(key, value) {
  localStorage.setItem(key, value);
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Ativar modo escuro" : "Ativar modo claro");
  }

  savePreference("netlipe:theme", isLight ? "light" : "dark");
}

function showToast(title, message) {
  catalogToastTitle.textContent = title;
  catalogToastMessage.textContent = message;
  catalogToast.hidden = false;

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    catalogToast.hidden = true;
  }, 2800);
}

function showLoader(message = "Carregando recomendações...") {
  const label = pageLoader?.querySelector(".page-loader-text");
  if (label) {
    label.textContent = message;
  }

  document.body.classList.add("is-loading");
  catalogContent?.setAttribute("aria-busy", "true");
}

function hideLoader() {
  document.body.classList.remove("is-loading");
  catalogContent?.setAttribute("aria-busy", "false");
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesFilter(movie) {
  if (currentFilter === "Todos") {
    return true;
  }

  if (currentFilter === "Serie") {
    return normalize(movie.genre).includes("série");
  }

  return normalize(movie.genre).includes(normalize(currentFilter));
}

function matchesQuery(movie) {
  if (!currentQuery) {
    return true;
  }

  const haystack = `${movie.title} ${movie.genre} ${movie.description}`.toLowerCase();
  return haystack.includes(currentQuery);
}

function createMovieCard(movie) {
  return `
    <a class="movie-card-link" href="./details.html" data-movie-id="${movie.id}" data-profile="${currentProfile}">
      <article class="movie-card" style="--movie-accent:${movie.accent}; --movie-secondary:${movie.secondary};">
        <div class="movie-card-content">
          <span class="movie-pill">${movie.genre}</span>
          <h3>${movie.title}</h3>
          <p class="movie-card-meta">${movie.year} | ${movie.runtime} | ${movie.rating}</p>
          <p>${movie.description}</p>
        </div>
      </article>
    </a>
  `;
}

function buildMovieDetails(profile, movie, rowTitle) {
  return {
    profile,
    rowTitle,
    ...movie
  };
}

function renderRows(rows) {
  const filteredRows = rows
    .map((row) => ({
      ...row,
      movies: row.movies.filter((movie) => matchesFilter(movie) && matchesQuery(movie))
    }))
    .filter((row) => row.movies.length > 0);

  if (!filteredRows.length) {
    catalogRows.innerHTML = `
      <section class="empty-state">
        <h2>Nada encontrado</h2>
        <p>Tente outro termo de busca ou selecione um filtro diferente para ${currentProfile}.</p>
      </section>
    `;
    return;
  }

  catalogRows.innerHTML = filteredRows.map((row) => `
    <section class="catalog-row" id="${row.id}" aria-labelledby="${row.id}-title">
      <div class="row-header">
        <div>
          <h2 id="${row.id}-title">${row.title}</h2>
          <p>${row.subtitle}</p>
        </div>
      </div>
      <div class="row-grid">
        ${row.movies.map((movie) => createMovieCard(movie)).join("")}
      </div>
    </section>
  `).join("");

  document.querySelectorAll(".movie-card-link").forEach((link) => {
    link.addEventListener("click", () => {
      const row = filteredRows.find((item) => item.movies.some((movie) => movie.id === link.dataset.movieId));
      const movie = row.movies.find((item) => item.id === link.dataset.movieId);
      savePreference("netlipe:selected-movie", JSON.stringify(buildMovieDetails(currentProfile, movie, row.title)));
    });
  });
}

function renderCatalog(profile) {
  const catalog = catalogs[profile] || catalogs.Felipe;
  const hero = catalog.hero;

  currentProfile = profile;
  currentCatalog = catalog;
  profileAvatar.src = catalog.avatar;
  profileAvatar.alt = `Avatar do perfil ${profile}`;
  profileName.textContent = profile;

  heroBanner.style.setProperty("--hero-accent", hero.accent);
  heroBanner.style.setProperty("--hero-secondary", hero.secondary);
  heroKicker.textContent = `Destaque para ${profile}`;
  heroTitle.textContent = hero.title;
  heroMeta.textContent = `${hero.year} | ${hero.genre} | ${hero.match} | ${hero.rating}`;
  heroDescription.textContent = hero.description;

  renderRows(catalog.rows);

  playHero.onclick = () => {
    savePreference("netlipe:selected-movie", JSON.stringify(buildMovieDetails(profile, hero, "Destaque principal")));
    window.location.href = "./details.html";
  };

  saveHero.onclick = () => {
    showToast("Minha Lista", `"${hero.title}" foi salvo para ${profile}.`);
  };

  showToast(`Catálogo de ${profile}`, "As sugestões personalizadas foram carregadas.");
}

function rerenderCurrentRows() {
  if (currentCatalog) {
    renderRows(currentCatalog.rows);
  }
}

function updateActiveFilter(target) {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === target);
    button.setAttribute("aria-pressed", String(button === target));
  });
}

function bootEntryTransition() {
  document.body.classList.add("is-entering");
  window.setTimeout(() => {
    document.body.classList.remove("is-entering");
  }, 760);
}

const activeProfile = localStorage.getItem("netlipe:selected-profile");
const savedTheme = localStorage.getItem("netlipe:theme") || "dark";

if (!activeProfile || !catalogs[activeProfile]) {
  window.location.href = "./index.html";
} else {
  applyTheme(savedTheme);
  showLoader();
  bootEntryTransition();
  window.setTimeout(() => {
    renderCatalog(activeProfile);
    hideLoader();
  }, 620);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(nextTheme);
});

searchInput?.addEventListener("input", (event) => {
  currentQuery = event.target.value.trim().toLowerCase();
  rerenderCurrentRows();
});

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    updateActiveFilter(button);
    rerenderCurrentRows();
  });
});

playHero?.addEventListener("click", () => {
  showLoader("Abrindo detalhes...");
});
