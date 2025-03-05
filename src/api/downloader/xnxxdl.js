module.exports = function(app) {
  const { xnxxDownload } = require("@mr.janiya/xnxx-scraper");
    app.get("/downloader/xnxx", async (req, res) => {
        try {
            const { url } = req.query;

            if (!url) {
                return res.status(400).json({ Status: false, message: "Parameter 'url' wajib diisi" });
            }

            const result = await xnxxDownload(url);

            if (!result) {
                return res.status(404).json({ Status: false, message: "Media tidak ditemukan!" });
            }

            res.json({
                results: result
            });

        } catch (error) {
            console.error("Error saat memproses permintaan:", error);
            res.status(500).json({ Status: false, message: "Terjadi kesalahan dalam memproses permintaan.", error: error.message });
        }
    });
};
