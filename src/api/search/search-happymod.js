const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
async function getMod(q) {
    try {
        const url = `https://happymod.com/search.html?q=${q}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let result = [];

        $(".pdt-app-box").each((_, el) => {
            const title = $(el).find("h3").text().trim();
            const link = "https://happymod.com" + $(el).find('a').attr('href');
            const rate = $(el).find("span.a-search-num").text().trim();

            result.push({ title, link, rate });
        });

        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

app.get("/search/happymod", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ status: false, message: "Masukkan query pencarian!" });

    try {
        const data = await getMod(query);
        if (data.length === 0) return res.json({ status: false, message: "Tidak ditemukan!" });

        res.json({ status: true, results: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Terjadi kesalahan!" });
    }
});
}
