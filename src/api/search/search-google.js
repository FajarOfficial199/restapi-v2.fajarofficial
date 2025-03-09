const google = require("google-sr");

module.exports = function(app) {
app.get("/search/google", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: "Mana querynya?" });
    }

    try {
        const data = await google.search({ query });
        if (!data.length) {
            return res.json({ message: `Tidak ada hasil untuk pencarian: ${query}` });
        }

        const results = data.map((res, i) => ({
            index: i + 1,
            title: res.title,
            description: res.description,
            link: res.link
        }));

        res.json({
            message: `Hasil pencarian untuk: ${query}`,
            results
        });
    } catch (error) {
        console.error("Google Search Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat melakukan pencarian." });
    }
});
}
