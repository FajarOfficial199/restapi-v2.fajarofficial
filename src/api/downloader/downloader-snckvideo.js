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
        return data[5]; // Ambil script yang mengandung metadata video
    }

    decodeUnicode(str) {
        return str.replace(/\\u(\w{4})/g, (match, group) => String.fromCharCode(parseInt(group, 16)));
    }

    async fetchData() {
        try {
            const { data: html } = await axios.get(this.url);
            const scriptData = this.getScript(html);

            const videoUrl = scriptData.match(/contentUrl:"(.*?)"/)?.[1] || null;
            const audioUrl = scriptData.match(/audio":{"name":".*?","contentUrl":"(.*?)"/)?.[1] || null;
            const image = scriptData.match(/image":"(.*?)"/)?.[1] || null;
            const duration = scriptData.match(/duration":"(.*?)"/)?.[1] || null;
            const description = scriptData.match(/description":"(.*?)"/)?.[1] || null;

            return {
                video_url: videoUrl ? this.decodeUnicode(videoUrl) : null,
                audio_url: audioUrl ? this.decodeUnicode(audioUrl) : null,
                image: image ? this.decodeUnicode(image) : null,
                duration: duration ? this.decodeUnicode(duration) : null,
                description: description ? this.decodeUnicode(description) : null,
            };
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
        const data = await snackVideo.fetchData();

        res.json({
            status: "success",
            ...data,
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan saat memproses link SnackVideo." });
    }
});
}
