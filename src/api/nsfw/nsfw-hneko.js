const axios = require('axios');

module.exports = function (app) {
    app.get('/nsfw/hentai-neko', async (req, res) => {
        try {
            const response = await axios.get('https://waifu.pics/api/nsfw/neko');
            const imageUrl = response.data.url;

            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': imageResponse.data.length,
            });
            res.end(imageResponse.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch NSFW image' });
        }
    });
};
