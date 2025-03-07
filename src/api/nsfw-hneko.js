const axios = require('axios');

module.exports = function(app) {
app.get('/nsfw/hentai-neko', async (req, res) => {
    try {
        const response = await axios.get('https://waifu.pics/api/nsfw/neko');
        res.json({ success: true, imageUrl: response.data.url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NSFW image' });
    }
});
}
