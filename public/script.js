if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log("✅ Service Worker registered", reg))
      .catch(err => console.error("❌ SW registration failed:", err));
  });
}

let debounceTimer;

async function loadTrendingAnime() {
  try {
    const response = await fetch('/api/trending');
    const data = await response.json();

    const container = document.getElementById('anime-list');
    container.innerHTML = '';
    data.forEach(anime => {
      container.appendChild(createAnimeCard(anime));
    });
  } catch (error) {
    console.error('Gagal memuat anime:', error);
  }
}

function createAnimeCard(anime) {
  const card = document.createElement('div');
  card.className = "cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105";
  card.onclick = () => {
    localStorage.setItem("selectedAnime", JSON.stringify(anime)); // Simpan data ke localStorage
    window.location.href = `detail.html`;
};
  card.innerHTML = `
    <img src="${anime.thumbnail_url}" alt="${anime.title}" class="w-full h-48 object-cover rounded-t-xl" />
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">${anime.title}</h3>
      ${anime.episode ? `<p class="text-sm"><span class="font-medium">Episode:</span> ${anime.episode}</p>` : ""}
      <p class="text-sm"><span class="font-medium">Genres:</span> ${anime.genres}</p>
      <p class="text-sm"><span class="font-medium">Year:</span> ${anime.year}</p>
    </div>
  `;
  return card;
}

async function searchAnime(keyword) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}&page=1`);
    const data = await response.json();

    const container = document.getElementById('anime-search-results');
    container.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
      data.forEach(anime => {
        container.appendChild(createAnimeCard(anime));
      });
    } else {
      container.innerHTML = `<p class="text-white text-center w-full">Anime tidak ditemukan.</p>`;
    }
  } catch (error) {
    console.error('Gagal mencari anime:', error);
  }
}

document.getElementById('search-input').addEventListener('input', (e) => {
  const keyword = e.target.value.trim();

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const resultsContainer = document.getElementById('anime-search-results');

    if (keyword === '') {
      resultsContainer.innerHTML = '';
      return;
    }

    searchAnime(keyword);
  }, 500); // debounce 500ms
});

loadTrendingAnime();
