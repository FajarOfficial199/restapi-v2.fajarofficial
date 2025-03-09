const viooapis = require('@vioo/apis');

module.exports = function (app) {
app.get('/downloader/terabox', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak ditemukan dalam parameter' });
  }

  try {
    const fileData = await viooapis.downloader.terabox(url);

    // Kirim response dengan data file
    res.json({
      success: true,
      data: fileData,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal mengunduh file dari TeraBox',
    });
  }
});
}