const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
async function TixID() {
    try {
        const { data } = await axios.get('https://www.tix.id/tix-now/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.tix.id/',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const $ = cheerio.load(data);
        const hasil = [];

        $('div.gt-blog-list > .gt-item').each((i, u) => {
            hasil.push({
                link: $(u).find('.gt-image > a').attr('href'),
                image: $(u).find('.gt-image > a > img').attr('src'),
                judul: $(u).find('.gt-title > a').text().trim(),
                tanggal: $(u).find('.gt-details > ul > li.gt-date span').text().trim(),
                deskripsi: $(u).find('.gt-excerpt > p').text().trim(),
            });
        });

        return hasil;
    } catch (err) {
        console.error(err);
        return { error: 'Gagal mengambil data' };
    }
}

app.get('/berita/tentangfilm', async (req, res) => {
    const berita = await TixID();
    res.json({
     berita 
    })
});
}