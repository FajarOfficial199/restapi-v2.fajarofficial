const viooapis = require('@vioo/apis');

module.exports = function (app) {
app.get('/downloader/gdrive', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak ditemukan dalam parameter' });
  }

  try {
    const googledrivedata = await viooapis.downloader.gdrive(url);

    res.json({
      success: true,
      data: googledrivedata,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil Google Drive dari URL',
    });
  }
});
}