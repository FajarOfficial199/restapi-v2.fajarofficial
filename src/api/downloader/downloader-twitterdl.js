const axios = require("axios")
const cheerio = require('cheerio')

module.exports = function (app) {
async function twitter(url) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!/x.com\/.*?\/status/gi.test(url)) {
                return reject("URL tidak valid! Pastikan menggunakan link X (Twitter) yang benar.");
            }

            const base_url = "https://x2twitter.com";
            const base_headers = {
                accept: "*/*",
                "accept-language": "en-EN,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest",
                Referer: "https://x2twitter.com/en",
            };

            const token = await axios
                .post(`${base_url}/api/userverify`, { url }, { headers: base_headers })
                .then((v) => v.data.token || "")
                .catch(() => { throw new Error("Gagal mendapatkan token."); });

            let r = await axios
                .post(`${base_url}/api/ajaxSearch`, new URLSearchParams({ q: url, lang: "id", cftoken: token }).toString(), { headers: base_headers })
                .then((v) => v.data)
                .catch(() => { throw new Error("Gagal mendapatkan data dari X."); });

            if (r.status !== "ok") throw new Error(`Gagal mendapatkan data karena ${r}`);

            const $ = cheerio.load(r.data.replace('"', '"'));
            let type = $("div").eq(0).attr("class");

            type = type.includes("tw-video") ? "video"
                : type.includes("video-data") && $(".photo-list").length ? "image"
                : "hybrid";

            let d = {};
            if (type === "video") {
                d = {
                    type,
                    download: $(".dl-action p").map((i, el) => {
                        let name = $(el).text().trim();
                        let fileType = name.includes("MP4") ? "mp4" : null;
                        let reso = fileType === "mp4" ? name.split(" ").pop().replace(//, "") : null;

                        return {
                            type: fileType,
                            reso,
                            url: $(el).find("a").attr("href"),
                        };
                    }).get(),
                };
            } else if (type === "image") {
                d = {
                    type,
                    download: $("ul.download-box li").map((i, el) => ({
                        type: "image",
                        url: $(el).find("a").attr("href"),
                    })).get(),
                };
            } else {
                d = { type, download: [] };
            }

            resolve(d);
        } catch (e) {
            reject(`Error: ${e.message}`);
        }
    });
}

app.get('/downloader/twitter', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Silahkan masukkan URL X (Twitter)" });
    }

    try {
        const result = await twitter(url);

        if (!result.download.length) {
            return res.status(404).json({ error: "Tidak ada media yang dapat diunduh" });
        }

        res.json({
            message: "Success",
            type: result.type,
            downloads: result.download
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan", details: error });
    }
});
}