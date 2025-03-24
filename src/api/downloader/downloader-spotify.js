const axios = require('axios');

module.exports = function (app) {
async function spotify(url) {
    try {
        const hai = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`);
        if (!hai.data.result || !hai.data.result.gid || !hai.data.result.id) {
            throw new Error('Data tidak valid dari API');
        }

        const hao = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${hai.data.result.gid}/${hai.data.result.id}`);
        if (!hao.data.result || !hao.data.result.download_url) {
            throw new Error('Gagal mendapatkan link download');
        }

        return {
            title: hai.data.result.name,
            download: `https://api.fabdl.com${hao.data.result.download_url}`,
            image: hai.data.result.image,
            duration: hai.data.result.duration_ms
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

app.get('/downloader/spotify', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Parameter url diperlukan' });

    try {
        const results = await spotify(url);
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
}
