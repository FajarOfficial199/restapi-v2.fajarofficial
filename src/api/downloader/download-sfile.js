const viooapis = require('@vioo/apis');

module.exports = function (app) {
app.get('/search/sfile', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak ditemukan dalam parameter' });
  }

  try {
    const downloadsfile = await viooapis.downloader.sfileDl(url);

    res.json({
      success: true,
      data: downloadsfile,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal Mendownload File',
    });
  }
});
}
