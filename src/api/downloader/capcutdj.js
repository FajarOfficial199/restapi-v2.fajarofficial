const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
    async function capcutdl(url) {
        if (!url || !url.startsWith('http')) {
            throw new Error('URL tidak valid.');
        }

        try {
            const response = await axios.get(url, { timeout: 10000 });
            const html = response.data;
            const $ = cheerio.load(html);

            const videoElement = $('video.player-o3g3Ag');
            const videoSrc = videoElement.attr('src') || null;
            const posterSrc = videoElement.attr('poster') || null;
            const title = $('h1.template-title').text().trim() || null;
            const actionsDetail = $('p.actions-detail').text().trim();
            
            let date = null, uses = null, likes = null;
            if (actionsDetail) {
                [date, uses, likes] = actionsDetail.split(',').map(item => item.trim());
            }

            const authorAvatar = $('span.lv-avatar-image img').attr('src') || null;
            const authorName = $('span.lv-avatar-image img').attr('alt') || null;

            if (!videoSrc || !posterSrc || !title || !date || !uses || !likes || !authorAvatar || !authorName) {
                throw new Error('Beberapa elemen penting tidak ditemukan di halaman.');
            }

            return {
                title,
                date,
                pengguna: uses,
                likes,
                author: {
                    name: authorName,
                    avatarUrl: authorAvatar
                },
                videoUrl: videoSrc,
                posterUrl: posterSrc
            };
        } catch (error) {
            console.error('Error fetching video details:', error.message);
            return null;
        }
    }

    app.get('/downloader/capcut', async (req, res) => {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                status: false,
                message: "❌ Parameter URL diperlukan!"
            });
        }

        try {
            const result = await capcutdl(url);

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "❌ Media tidak ditemukan atau link tidak valid!"
                });
            }

            res.json({
                status: true,
                results: result
            });

        } catch (error) {
            console.error("Error pada /downloader/capcut:", error);
            res.status(500).json({
                status: false,
                message: "Terjadi kesalahan saat memproses permintaan.",
                error: error.message
            });
        }
    });
};