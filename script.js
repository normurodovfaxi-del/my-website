
const grid = document.getElementById("newsGrid");
const statusText = document.getElementById("status");
const errorBox = document.getElementById("error");
const emptyBox = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");
const pageTitle = document.getElementById("pageTitle");

const labels = {
  barchasi: "So‘nggi yangiliklar",
  ozbekiston: "O‘zbekiston",
  talim: "Ta’lim",
  texnologiya: "Texnologiya",
  sport: "Sport"
};

let news = [];
let currentPage = "barchasi";

function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function validUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href : "";
  } catch {
    return "";
  }
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("uz");

  const filtered = news.filter(item => {
    const categoryMatch =
      currentPage === "barchasi" || item.category === currentPage;

    const text = `${item.title} ${item.description}`
      .toLocaleLowerCase("uz");

    return categoryMatch && text.includes(query);
  });

  pageTitle.textContent = labels[currentPage];
  grid.replaceChildren();

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "news-card";

    const imageUrl = validUrl(item.image);
    const articleUrl = validUrl(item.link) || "https://zamin.uz/";

    const media = imageUrl
      ? `<img class="news-image" src="${escapeText(imageUrl)}"
          alt="${escapeText(item.title)}" loading="lazy">`
      : `<div class="image-placeholder" aria-label="Rasm mavjud emas">📰</div>`;

    const date = item.date
      ? new Date(item.date).toLocaleDateString("uz-UZ")
      : "";

    card.innerHTML = `
      ${media}
      <div class="card-content">
        <span class="tag">${escapeText(labels[item.category] || "Yangilik")}</span>
        <h3>${escapeText(item.title)}</h3>
        <p>${escapeText(item.description || "Maqolani asl manbadan o‘qing.")}</p>
        <div class="news-date">${escapeText(date)} · Manba: Zamin.uz</div>
        <a class="read-more" href="${escapeText(articleUrl)}"
           target="_blank" rel="noopener noreferrer">
          Batafsil o‘qish ↗
        </a>
      </div>
    `;

    const img = card.querySelector("img");
    if (img) {
      img.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "📰";
        img.replaceWith(placeholder);
      }, { once: true });
    }

    grid.appendChild(card);
  });

  emptyBox.hidden = filtered.length !== 0;
  statusText.textContent = `${filtered.length} ta xabar ko‘rsatildi`;
}

async function loadNews() {
  errorBox.hidden = true;
  statusText.textContent = "Zamin.uz yangiliklari yuklanmoqda...";
  grid.replaceChildren();

  try {
    const response = await fetch("/api/news");

    if (!response.ok) {
      throw new Error("RSS manbasiga ulanish muvaffaqiyatsiz tugadi.");
    }

    const data = await response.json();
    news = Array.isArray(data.news) ? data.news : [];

    if (!news.length) {
      throw new Error("RSS tasmasida hozircha xabar topilmadi.");
    }

    render();
    statusText.textContent =
      `${news.length} ta xabar · Manba: Zamin.uz`;
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent =
      "Yangiliklarni olib bo‘lmadi. " + error.message +
      " server.js ishga tushganini va RSS manzilini tekshiring.";
    statusText.textContent = "Yangiliklarni yuklashda xatolik";
  }
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    currentPage = button.dataset.page;

    document.querySelectorAll(".nav-btn").forEach(btn =>
      btn.classList.toggle("active", btn === button)
    );

    render();
  });
});

searchInput.addEventListener("input", render);
document.getElementById("refreshBtn").addEventListener("click", loadNews);

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.getElementById("themeBtn").textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

document.getElementById("homeLink").addEventListener("click", event => {
  event.preventDefault();
  currentPage = "barchasi";
  document.querySelectorAll(".nav-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.page === "barchasi")
  );
  render();
});

document.getElementById("year").textContent = new Date().getFullYear();

loadNews();