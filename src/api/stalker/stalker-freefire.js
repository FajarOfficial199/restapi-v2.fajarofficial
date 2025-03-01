const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

/**
 * Get Free Fire Account Info (Detailed)
 * @param {string} id - Free Fire User ID
 * @returns {Promise<Object>}
 */

module.exports = function (app) {
    async function ffStalk(id) {
    try {
        if (!id) throw new Error("User ID is required");

        let formdata = new URLSearchParams();
        formdata.append('uid', id);

        const instance = axios.create({
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://tools.freefireinfo.in",
                "referer": "https://tools.freefireinfo.in/profileinfo.php?success=1",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            }
        });

        console.log(`[INFO] Fetching data for UID: ${id}`);

        let { data } = await instance.post('https://tools.freefireinfo.in/profileinfo.php?success=1', formdata);

        const $ = cheerio.load(data);
        let resultDiv = $('div.result').html();

        if (!resultDiv) throw new Error("Failed to retrieve account data. Check if the user ID is valid.");

        let tr = resultDiv.split('<br>');

        const getText = (index, defaultValue = 'N/A') => {
            if (tr[index] && tr[index].includes(': ')) {
                return tr[index].split(': ')[1] || defaultValue;
            }
            return defaultValue;
        };

        // Parsing informasi utama akun
        let accountInfo = {
            name: getText(0, 'Unknown').replace('Name: ', ''),
            bio: getText(14),
            like: getText(2),
            level: getText(3),
            exp: getText(4),
            region: getText(5),
            honorScore: getText(6),
            accountCreated: getText(10),
            lastLogin: getText(11),
            preferMode: getText(12),
            language: getText(13),
            booyahPassPremium: getText(16),
            booyahPassLevel: getText(17),
            petInformation: {
                name: getText(20, 'No Pet'),
                level: getText(21, 'No Pet'),
                exp: getText(22, 'No Pet'),
                starMarked: getText(23, 'No Pet'),
                selected: getText(24, 'No Pet')
            },
            guild: getText(26, 'No Guild'),
            equippedItems: []
        };

        // **Menambahkan Statistik Permainan**
        accountInfo.stats = {
            totalKills: getText(27, '0'),
            totalDeaths: getText(28, '0'),
            kdRatio: getText(29, '0.0'),
            headshotRate: getText(30, '0%'),
            accuracy: getText(31, '0%'),
            totalMatches: getText(32, '0'),
            totalWins: getText(33, '0'),
            winRate: getText(34, '0%')
        };

        // **Menambahkan Detail Rank**
        accountInfo.rank = {
            battleRoyale: {
                currentRank: getText(7, 'Unknown'),
                rankPoints: getText(8, '0'),
                previousRank: getText(35, 'Unknown')
            },
            clashSquad: {
                currentRank: getText(9, 'Unknown'),
                rankPoints: getText(36, '0'),
                previousRank: getText(37, 'Unknown')
            }
        };

        // **Menambahkan Informasi Guild**
        accountInfo.guildInfo = {
            name: getText(38, 'No Guild'),
            level: getText(39, '0'),
            members: getText(40, '0')
        };

        // **Menambahkan Data Senjata Favorit**
        accountInfo.favoriteWeapons = {
            mostUsed: getText(41, 'Unknown'),
            highestKills: getText(42, '0')
        };

        // **Menambahkan Informasi Mode Permainan**
        accountInfo.favoriteMode = {
            mode: getText(43, 'Unknown'),
            winRate: getText(44, '0%')
        };

        // Mengambil daftar item yang sedang digunakan
        $('.equipped-items .equipped-item').each((i, e) => {
            let itemName = $(e).find('p').text().trim();
            let itemImg = $(e).find('img').attr('src');
            if (itemName && itemImg) {
                accountInfo.equippedItems.push({ name: itemName, img: itemImg });
            }
        });

        console.log(`[INFO] Successfully retrieved data for UID: ${id}`);
        return accountInfo;

    } catch (error) {
        console.error(`[ERROR] ${error.message}`);
        return { error: error.message };
    }
    }

    app.get('/stalker/game/freefire', async (req, res) => {
        let { id } = req.query;

        if (!id) {
            return res.status(400).json({ status: false, message: 'Masukkan parameter id' });
        }

        try {
            let result = await ffStalk(id);
            res.json({ status: true, data: result });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    });
};
