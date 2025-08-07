const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Proxy API call (untuk menghindari CORS kalau dibutuhkan)
app.get('/api/trending', async (req, res) => {
  try {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const response = await fetch('https://animeapi.skin/trending');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data trending anime' });
  }
});

app.get('/api/search', async (req, res) => {
  const keyword = req.query.q;
  const page = req.query.page || 1;
  if (!keyword) return res.status(400).json({ error: 'Parameter q wajib diisi' });

  try {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const response = await fetch(`https://animeapi.skin/search?q=${encodeURIComponent(keyword)}&page=${page}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data pencarian' });
  }
});

app.get('/api/episodes', async (req, res) => {
  const title = req.query.title;
  if (!title) return res.status(400).json({ error: 'Parameter title wajib diisi' });

  try {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const response = await fetch(`https://animeapi.skin/episodes?title=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data episode' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});