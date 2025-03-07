const axios = require('axios');

module.exports = function(app) {
app.get('/nsfw/hentai-neko', async (req, res) => {
    try {
        const neko = await axios.get('https://waifu.pics/api/nsfw/neko');
        res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': neko.length,
            });
            res.end(neko);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NSFW image' });
    }
});
}
