const viooapis = require('@vioo/apis');

module.exports = function (app) {
app.get('/search/sfile', async (req, res) => {
  const query = req.query.q;

  if (!url) {
    return res.status(400).json({ error: 'Query tidak ditemukan dalam parameter' });
  }

  try {
    const searchsfile = await viooapis.search.sfilesearch(query);

    res.json({
      success: true,
      data: searchsfile,
    });
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal Mencari di Sfile',
    });
  }
});
}
