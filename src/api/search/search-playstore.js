const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  function PlayStore(search) {
	return new Promise(async (resolve, reject) => {
		try {
			const { data, status } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
			const hasil = []
			const $ = cheerio.load(data)
			$('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
				const linkk = $(u).attr('href')
				const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
				const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
				const img = $(u).find('.j2FCNc > img').attr('src')
				const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
				const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
				const link = `https://play.google.com${linkk}`
				hasil.push({
					link: link,
					nama: nama ? nama : 'No name',
					developer: developer ? developer : 'No Developer',
					img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
					rate: rate ? rate : 'No Rate',
					rate2: rate2 ? rate2 : 'No Rate',
					link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
				})
			})
			if (hasil.every(x => x === undefined))
			return resolve({
				message: 'Tidak ada result!'
			})
			resolve(hasil)
		} catch (err) {
			console.error(err)
		}
	})
};
    app.get('/search/playstore', async (req, res) => {
        const nama = req.query.nama;

        if (!nama) {
            return res.json({
                status: false,
                message: 'Nama pencarian tidak diberikan!'
            });
        }

        try {
            const hasil = await PlayStore(nama);

            if (!hasil || !Array.isArray(hasil) || hasil.length === 0) {
                return res.json({
                    status: false,
                    message: 'Tidak ditemukan hasil untuk pencarian tersebut.'
                });
            }

            const result = hasil.slice(0, 3).map((item, i) => ({
                rank: i + 1,
                nama: item.nama || "Tidak tersedia",
                developer: item.developer || "Tidak tersedia",
                rating: item.rate || "Tidak tersedia",
                link: item.link || "Tidak tersedia",
                link_dev: item.link_dev || "Tidak tersedia",
                img: item.img || "Tidak tersedia"
            }));

            res.json({
                status: true,
                result
            });

        } catch (error) {
            console.error('Error saat mengambil data dari Play Store:', error);
            res.status(500).json({
                status: false,
                message: 'Terjadi kesalahan saat mengambil data dari Play Store.',
                error: error.message
            });
        }
    });
};