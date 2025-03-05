async function videy(url) {
  try {
    let id = url.split("id=")[1];
    if (!id) throw new Error("Invalid URL format");

    let typ = ".mp4";
    if (id.length === 9 && id.charAt(8) === "2") {
      typ = ".mov";
    }

    return `https://cdn.videy.co/${id + typ}`;
  } catch (error) {
    console.error(`Error processing the URL: ${error.message}`);
    return null;
  }
}

module.exports = function (app) {
app.get("/downloader/videy", async (req, res) => {
  const url = req.query.url; // Mengambil parameter URL dari query
  
  if (!url) {
    return res.status(400).json({ error: "Parameter 'url' diperlukan" });
  }

  const videoUrl = await videy(url);
  if (!videoUrl) {
    return res.status(500).json({ error: "Gagal memproses URL" });
  }

  res.json({ download_url: videoUrl });
});
}
