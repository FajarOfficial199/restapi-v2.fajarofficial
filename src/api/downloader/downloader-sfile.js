const axios = require('axios')
const cheerio = require('cheerio')

module.exports = function (app) {
async function sfile(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const headers = {
        'referer': url,
        'user-Agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36',
      };

      let getPage = await axios.get(url, { headers });
      let $ = cheerio.load(getPage.data);
      let safelink = $("#safe_link").attr("href");

      headers.cookie = getPage.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
      headers.referer = safelink;

      let resPage = await axios.get(safelink, { headers });
      let f = cheerio.load(resPage.data);

      const [dl, [name, ext, size], downloaded, uploaded, mime, author] = [
        f("#download").attr("href") + '&k=' + f("#download").attr("onclick").match(/&k='\+(.*?)';/)?.[1].replace("'", ''),
        (() => {
          let s = f('.w3-text-blue b').text().match(/^(.+?)(?:\.([^.\s()]+))?(?:\s*([^)]*))?$/);
          return [s[1].trim(), s[2], s[3]];
        })(),
        f('.icon-cloud-download').parent().text().split(':')[1]?.trim(),
        f('.icon-upload').parent().text().split(':')[1]?.trim(),
        f('.list:nth-child(2)').eq(0).text().slice(3).trim(),
        f('.list a').first().text().trim(),
      ];

      resolve({
        name,
        size,
        author,
        uploaded,
        downloaded,
        mime,
        ext,
        dl
      });
    } catch (e) {
      reject(e);
    }
  });
}

app.get('/downloader/sfile', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Silahkan masukkan URL Sfile" });
  }

  if (!url.match(/sfile\.mobi/i)) {
    return res.status(400).json({ error: "URL tidak valid! Pastikan URL dari sfile.mobi" });
  }

  try {
    const result = await sfile(url);

    if (!result.dl) {
      return res.status(404).json({ error: "Link download tidak tersedia", details: result });
    }

    res.json({
      message: "Success",
      data: {
        name: result.name,
        ext: result.ext,
        size: result.size || "Tidak diketahui",
        author: result.author || "Tidak diketahui",
        uploaded: result.uploaded || "Tidak diketahui",
        downloaded: result.downloaded || "0",
        mime: result.mime || "application/octet-stream",
        download_link: result.dl
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan", details: error.message });
  }
});
}