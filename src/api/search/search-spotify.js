const axios = require('axios');

module.exports = function (app) {
async function spotifySearch(query) {
    try {
        const { data } = await axios.get(`https://www.bhandarimilan.info.np/spotisearch?query=${encodeURIComponent(query)}`);
        const results = data.map(ft => ({
            nama: ft.name,
            artis: ft.artist,
            rilis: ft.release_date,
            durasi: ft.duration,
            link: ft.link,
            image: ft.image_url
        }));
        return results;
    } catch (err) {
        throw new Error(err.message);
    }
}
app.get('/search/spotify', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Parameter query diperlukan' });

    try {
        const data = await spotifySearch(query);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
}
