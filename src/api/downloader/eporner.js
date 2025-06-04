const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
app.get('/downloader/eporner', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({
            status: false,
            creator: 'Fajar Official',
            message: 'URL parameter is required'
        });
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Cari video URL dari tag <video> atau <source>
        const videoUrl = $('video > source').attr('src');
        const title = $('h1.title').text().trim();

        if (!videoUrl) {
            return res.status(404).json({
                status: false,
                creator: 'Fajar Official',
                message: 'Video not found on the page'
            });
        }

        res.json({
            status: true,
            creator: 'Fajar Official',
            result: {
                title,
                video: videoUrl
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            creator: 'Fajar Official',
            message: 'Error fetching video',
            error: error.message
        });
    }
});
}
