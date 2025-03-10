const vioo = require('@vioo/apis')

module.exports = function (app) {
app.get('/downloader/sfile', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Silahkan masukkan URL Sfile" });
  }

  try {
    const result = await vioo.downloader.sfileDl(url);

    if (!result.dl) {
      return res.status(404).json({ error: "Link download tidak tersedia", details: result });
    }

    res.json({
      message: "Success",
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan", details: error.message });
  }
});
}
