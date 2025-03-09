const axios = require('axios');

module.exports = function (app) {
    app.get('/downloader/mediafire', async (req, res) => {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({
                status: false,
                message: "Masukkan URL MediaFire yang valid! Contoh: /api/downloader/mediafire?url=https://www.mediafire.com/file/qyk2na28cidzt3p/cf2.js/file"
            });
        }

        // Validasi format URL MediaFire
        const mediafireRegex = /^https?:\/\/(www\.)?mediafire\.com\/file\/[a-zA-Z0-9]+\/[^/]+\/file$/;
        if (!mediafireRegex.test(url)) {
            return res.status(400).json({
                status: false,
                message: "URL tidak valid! Pastikan itu adalah URL dari MediaFire."
            });
        }

        try {
            // Menggunakan API pihak ketiga untuk mendapatkan informasi file
            const response = await axios.post('http://kinchan.sytes.net/mediafire/download', { url });

            if (!response.data || response.data.error) {
                return res.status(500).json({
                    status: false,
                    message: response.data.error || "Gagal mengambil data dari API pihak ketiga."
                });
            }

            const { filename, size, mimetype, download } = response.data;

            res.json({
                status: true,
                results: {
                    filename,
                    size,
                    mimetype,
                    downloadUrl: download
                }
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Terjadi kesalahan saat memproses permintaan.",
                error: error.message
            });
        }
    });
};