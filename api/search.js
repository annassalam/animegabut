export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Parameter 'q' diperlukan" });
  }

  try {
    const response = await fetch(`https://animeapi.skin/search?q=${encodeURIComponent(q)}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil hasil pencarian" });
  }
}
