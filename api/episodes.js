export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Parameter 'title' diperlukan" });
  }

  try {
    const response = await fetch(`https://animeapi.skin/episodes?title=${encodeURIComponent(title)}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil daftar episode" });
  }
}
