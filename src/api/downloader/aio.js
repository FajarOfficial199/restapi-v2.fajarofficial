const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');


const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": "https://getindevice.com/facebook-video-downloader/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
};

/**
 * Mengambil token dari halaman downloader
 * @returns {Promise<String>}
 */
 module.exports = function (app) {
async function getToken() {
    try {
        let { data } = await axios.get('https://getindevice.com/facebook-video-downloader/', { headers });
        const $ = cheerio.load(data);
        return $('input#token').attr('value');
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}

/**
 * Mengambil data video dari URL menggunakan API AIO
 * @param {String} url 
 * @returns {Promise<Object>}
 */
async function aio(url) {
    try {
        let token = await getToken();
        if (!token) {
            throw new Error("Token tidak ditemukan");
        }

        let formData = new FormData();
        formData.append('url', url);
        formData.append('token', token);

        let { data } = await axios.post('https://getindevice.com/wp-json/aio-dl/video-data/', formData, {
            headers: {
                ...headers,
                ...formData.getHeaders()
            }
        });

        return data;
    } catch (error) {
        console.error("Error fetching video data:", error);
        return { error: "Gagal mengambil data video" };
    }
}

app.get('/downloader/aio', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Parameter 'url' diperlukan" });
    }

    const result = await aio(url);
    res.json(result);
});
}