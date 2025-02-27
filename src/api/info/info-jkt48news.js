const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
// Fungsi untuk mengambil berita terbaru JKT48
async function jktNews(lang = "id") {
    try {
        const { data } = await axios.get(`https://jkt48.com/news/list?lang=${lang}`);
        const $ = cheerio.load(data);

        const news = [];
        $(".entry-news__list").each((index, element) => {
            const title = $(element).find("h3 a").text().trim();
            const link = $(element).find("h3 a").attr("href");
            const date = $(element).find("time").text().trim();

            news.push({
                title,
                link: "https://jkt48.com" + link,
                date,
            });
        });

        return news;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return { error: error.message };
    }
}

// Endpoint untuk mendapatkan berita terbaru JKT48
app.get("/info/jkt48news", async (req, res) => {
    const lang = req.query.lang || "id";

    try {
        const news = await jktNews(lang);

        if (news.length === 0) {
            return res.json({ message: "⚠️ Tidak ada berita terbaru JKT48 yang ditemukan." });
        }

        res.json({
            message: "🎤 Berita Terbaru JKT48 🎤",
            news: news.slice(0, 5), // Batasi hanya 5 berita terbaru
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "⚠️ Terjadi kesalahan saat mengambil berita JKT48." });
    }
});
}
