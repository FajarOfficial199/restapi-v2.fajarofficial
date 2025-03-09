const axios = require('axios');

module.exports = function (app) {
async function spotidown(url) {
    try {
        console.log(`🔍 Fetching data from: ${url}`);

        const response = await axios.post('https://spotymate.com/api/download-track',
            { url: url },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://spotymate.com/'
                }
            }
        );

        if (response.data && response.data.file_url) {
            return {
                status: true,
                file_url: response.data.file_url
            };
        } else {
            return {
                status: false,
                message: '❌ Tidak dapat menemukan link unduhan!'
            };
        }
    } catch (error) {
      console.log(error)
        return {
            status: false,
            message: `❌ Error: ${error.message}`
        };
    }
}

app.get('/downloader/spotify', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ status: false, message: '❌ URL Spotify diperlukan!' });
    }

    const result = await spotidown(url);
    res.json(result);
});
}