const vioo = require('@vioo/apis');

module.exports = function (app) {
  app.get('/downloader/sfile', async (req, res) => {
    const { url } = req.query;

    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "Silahkan masukkan URL Sfile yang valid" });
    }

    try {
      const result = await vioo.downloader.sfileDl(url);

      if (!result || !result.dl) {
        return res.status(404).json({ error: "Link download tidak tersedia", details: result });
      }

      res.json({ message: "Success", data: result });
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data", details: error.message });
    }
  });
};
