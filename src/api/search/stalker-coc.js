const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCOC(playerTag) {
    try {
        const url = `https://brawlace.com/coc/players/%23${playerTag}`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/114.0.0.0 Safari/537.36"
        };
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        if (!$('h2.pt-3').length) {
            return { error: "Data tidak ditemukan atau Brawlace sedang membatasi akses." };
        }

        const getText = (selector, regex) => {
            const text = $(selector).filter((_, el) => $(el).text().includes(regex.split(" ")[0])).text();
            return text.match(new RegExp(regex))?.[1] || "Tidak ditemukan";
        };

        const result = {
            name: $('h2.pt-3').text().trim() || "Tidak ditemukan",
            clan: $('h3.pb-2 a').text().trim() || "Tidak ada clan",
            level: getText('div.card-body', "Level (\\d+)"),
            trophies: getText('div.card-body', "Trophies (\\d+)"),
            bestTrophy: getText('div.card-body', "Best Season.*?Trophies (\\d+)"),
            townHall: getText('div.card-body', "Town Hall Level (\\d+)"),
            warStars: getText('div.card-body', "War Stars (\\d+)"),
            attackWins: getText('div.card-body', "Attack Wins (\\d+)"),
            defenseWins: getText('div.card-body', "Defense Wins (\\d+)"),
            legendRank: getText('div.card-body', "Current Season.*?Rank (\\d+)"),
            profileUrl: url
        };

        return result;
    } catch (error) {
        console.error("Error:", error.message);
        return { error: "Gagal mengambil data. Situs mungkin memblokir akses bot atau mengalami perubahan struktur." };
    }
}

module.exports = function (app) {
    app.get('/stalker/coc', async (req, res) => {
        try {
            const playerTag = req.query.tag;
            if (!playerTag) {
                return res.status(400).json({ status: "error", message: "Parameter 'tag' diperlukan." });
            }

            const data = await scrapeCOC(playerTag);
            if (data.error) {
                return res.status(404).json({ status: "error", message: data.error });
            }

            res.json({
                status: "success",
                message: "Data berhasil diambil",
                data
            });
        } catch (err) {
            console.error("Server Error:", err.message);
            res.status(500).json({ status: "error", message: "Terjadi kesalahan di server." });
        }
    });
};
