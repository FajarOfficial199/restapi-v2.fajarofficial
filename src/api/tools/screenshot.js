const viooapis = require('@vioo/apis');

module.exports = function (app) {
app.get('/tools/screenshot', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak ditemukan dalam parameter' });
  }

  try {
    const screenshotData = await viooapis.tools.screenshotWeb(url);

    // Kirim response dengan hasil screenshot
    res.json({
      success: true,
      data: screenshotData,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil screenshot dari URL',
    });
  }
});
}