const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
async function scrapeCOC(playerTag) {
    try {
        const url = `https://brawlace.com/coc/players/%23${playerTag}`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const getText = (selector, regex) => 
            $(selector).filter((_, el) => $(el).text().includes(regex.split(" ")[0]))
                .text().match(new RegExp(regex))?.[1] || "Tidak ditemukan";

        const result = {
            name: $('h2.pt-3').text().trim() || "Tidak ditemukan",
            clan: $('h3.pb-2 a').text().trim() || "Tidak ada clan",
            level: getText('div.card-body', "Level (\\d+)"),
            trophies: getText('div.card-body', "Trophies (\\d+)"),
            bestTrophy: $('div.card-body').filter((_, el) => $(el).text().includes("Best Season")).text().match(/Trophies (\d+)/)?.[1] || "Tidak ditemukan",
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
        return null;
    }
}

    app.get('/stalker/coc', async (req, res) => {
        const playerTag = req.query.tag;
        if (!playerTag) {
            return res.status(400).json({ error: "Parameter 'tag' diperlukan" });
        }

        const data = await scrapeCOC(playerTag);
        if (!data) {
            return res.status(500).json({ error: "Gagal mengambil data" });
        }

        res.json(data);
    });
};
