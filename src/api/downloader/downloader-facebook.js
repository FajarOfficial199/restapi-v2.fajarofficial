const { savefrom } = require("@bochilteam/scraper");

module.exports = function (app) {
app.get("/downloader/facebook", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, message: "Masukkan URL Facebook!" });
    }

    try {
        const result = await savefrom(url);

        if (!result || !result.url || result.url.length === 0) {
            return res.status(404).json({ success: false, message: "Video tidak ditemukan atau tidak dapat diunduh!" });
        }

        res.json({
            success: true,
            title: result.title || "Facebook Video",
            thumbnail: result.thumbnail || null,
            videos: result.url.map(video => ({
                url: video.url,
                quality: video.quality || "Unknown",
                type: video.type || "Unknown"
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data.", error: error.message });
    }
});
}