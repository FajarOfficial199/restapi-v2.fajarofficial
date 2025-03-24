const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = function (app) {
  async function sfileDl(url) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
            'Referer': url,
            'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': '"Android"',
            'Cookie': 'PHPSESSID=arbi7j8s8ia8eclu59el9bqk5a; _u=b59ba6d11bf210187524d1ac9fedda22; _ga=GA1.1.1751269854.1742109307; _ga_XNQ10X1V2J=GS1.1.1742109306.1.1.1742109333.0.0.0'
        };

        const res = await fetch(url, { headers });
        const html = await res.text();
        const $ = cheerio.load(html);

        const title = $('h1.intro').text().trim();
        const file_name = $('img.intro').attr('alt');
        const mimetype = $('.icon-file-code-o').parent().text().replace('-', '').trim();
        const uploader = $('a[rel="nofollow"]').text().trim();
        const uploaded = $('.icon-upload').parent().text().replace('Uploaded:', '').replace('-', '').trim();
        const download = $('#download').attr('href');

        const file_size_match = $('meta[name="description"]').attr('content').match(/ukuran ([\d.,]+\s?\w+)/i);
        const file_size = file_size_match ? file_size_match[1] : '-';
        const extension = file_name ? file_name.split('.').pop() : null;

        return {
            title,
            file_size,
            file_name,
            mimetype,
            extension,
            uploader,
            uploaded,
            download
        };

    } catch (err) {
        throw new Error(err.message);
    }
  }
app.get('/downloader/sfile', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'Parameter url diperlukan' });

    try {
        const data = await sfileDl(url);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
}
