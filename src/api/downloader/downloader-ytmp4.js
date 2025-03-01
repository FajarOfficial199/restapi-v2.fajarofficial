const axios = require("axios");


module.exports = function (app) {
async function getInfo(url) {
    try {
        let { data } = await axios.get(`https://api.flvto.top/@api/search/YouTube/${url}`, {
            headers: {
                "Referer": "https://ytshortsdown.com/",
                "Origin": "https://ytshortsdown.com",
                "Content-Type": "application/json",
                "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
            }
        });
        return data.items[0];
    } catch (error) {
        throw new Error("Gagal mengambil informasi video.");
    }
}

async function mp4(url) {
    try {
        const id = url.split("v=")[1];
        let { data } = await axios.post(
            "https://es.flvto.top/converter",
            { "id": id, "fileType": "mp4" },
            {
                headers: {
                    "Referer": `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
                    "Origin": "https://es.flvto.top",
                    "Content-Type": "application/json",
                    "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
                }
            }
        );

        return {
            title: data.title,
            result: data.formats[0]
        };
    } catch (error) {
        throw new Error("Gagal mengonversi video.");
    }
}

app.get("/downloader/ytmp4", async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ success: false, message: "Parameter 'url' diperlukan." });
        }

        const info = await getInfo(url);
        const video = await mp4(url);
        console.log(data);

        res.json({
            success: true,
            title: info.title,
            thumbnail: info.thumbnail,
            duration: info.duration,
            download: video.result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
}
