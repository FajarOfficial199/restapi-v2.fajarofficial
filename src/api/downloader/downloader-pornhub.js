const Pornhub = require("@justalk/pornhub-api");

module.exports = function (app) {
app.get("/downloader/pornhub", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "Masukkan URL video dari Pornhub!" });
    }

    try {
        const videoData = await Pornhub.video(url);

        if (!videoData || !videoData.media || !videoData.media.length) {
            return res.status(404).json({ error: "Video tidak ditemukan atau tidak dapat diunduh." });
        }

        const downloadLinks = videoData.media.map((item) => ({
            quality: item.quality,
            url: item.url,
        }));

        res.json({
            title: videoData.title,
            duration: videoData.duration,
            views: videoData.views,
            likes: videoData.likes,
            dislikes: videoData.dislikes,
            downloadLinks,
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan dalam mengambil data video.", details: error.message });
    }
});
}
