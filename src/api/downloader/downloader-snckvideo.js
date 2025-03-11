const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function (app) {
class SnackVideo {
    constructor(url) {
        this.url = url;
    }

    getScript(html) {
        const $ = cheerio.load(html);
        let data = [];
        $("script").each((_, a) => {
            data.push($(a).html());
        });
        return data[5]; // Ambil script yang mengandung data video
    }

    decodeUnicode(str) {
        return str.replace(/\\u(\w{4})/g, (match, group) => String.fromCharCode(parseInt(group, 16)));
    }

    async fetchData() {
        try {
            const { data: html } = await axios.get(this.url);
            const getScript = this.getScript(html);

            const _contentUrl = getScript.split('contentUrl:"');
            return this.decodeUnicode(_contentUrl[1].split('",commentUrl:"')[0]);
        } catch (error) {
            throw new Error("Gagal mengambil data dari SnackVideo.");
        }
    }
}

app.get("/downloader/snackvideo", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Harap masukkan URL SnackVideo." });
    }

    try {
        const snackVideo = new SnackVideo(url);
        const videoUrl = await snackVideo.fetchData();

        res.json({
            status: "success",
            video_url: videoUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan saat memproses link SnackVideo." });
    }
});
}
