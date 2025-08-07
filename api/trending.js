export default async function handler(req, res) {
  try {
    const response = await fetch("https://animeapi.skin/trending");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data trending" });
  }
}
