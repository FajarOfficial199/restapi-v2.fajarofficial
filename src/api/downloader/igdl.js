const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

module.exports = function(app) {
  
  async function instanav(url) {
    const data = qs.stringify({
        'q': url,
        't': 'media',
        'lang': 'en'
    });

    const config = {
        method: 'POST',
        url: 'https://instanavigation.app/api/ajaxSearch',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'id-ID',
            'referer': 'https://instanavigation.app/',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-requested-with': 'XMLHttpRequest',
            'origin': 'https://instanavigation.app',
            'alt-used': 'instanavigation.app',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'priority': 'u=0',
            'te': 'trailers',
        },
        data: data
    };

    try {
        const api = await axios.request(config);
        const html = api.data.data;
        const $ = cheerio.load(html);

        const thumbnail = $('.download-items__thumb img').attr('src');
        const downloadUrls = [];

        $('.download-items__btn a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                downloadUrls.push(href);
            }
        });

        const urlParams = new URLSearchParams(downloadUrls[0]?.split('?')[1]);
        let filename = urlParams.get('filename');
        if (filename && filename.endsWith('.mp4')) {
            filename = filename.slice(0, -4);
        }

        return {
            title: filename || 'Title not found',
            thumbnail: thumbnail || 'Thumbnail not found',
            downloadUrls: downloadUrls.length > 0 ? downloadUrls : ['Download URL not found']
        };
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        return null;
    }
}

    app.get('/downloader/igdl', async (req, res) => {
        try {
            const url = req.query.url;

            if (!url) {
                return res.status(400).json({ error: "Parameter 'url' diperlukan!" });
            }

            if (!url.match(/instagram\.com\/(reel|p|tv)/gi)) {
                return res.status(400).json({ error: "URL harus berupa link Instagram Reel, Post, atau TV!" });
            }

            const result = await ptz.instanav(url);

            if (!result || !result.downloadUrls || result.downloadUrls.length === 0 || result.downloadUrls[0] === 'Download URL not found') {
                return res.status(404).json({ error: "Media tidak ditemukan!" });
            }

            res.json({
                title: result.title || "Tidak ada judul",
                thumbnail: result.thumbnail || "Tidak ada thumbnail",
                downloadUrls: result.downloadUrls
            });

        } catch (error) {
            console.error("Error saat memproses permintaan:", error);
            res.status(500).json({ error: "Terjadi kesalahan dalam memproses permintaan." });
        }
    });
};