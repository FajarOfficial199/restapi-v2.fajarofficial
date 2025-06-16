const { uid } = require('free-fire-apis');

module.exports = function (app) {
    app.get('/api/check-nickname', async (req, res) => {
  const { playerId } = req.body;

  try {
    const data = await uid(playerId);
    if (data && data.Nickname) {
      res.json({ success: true, nickname: data.Nickname, region: data.Region });
    } else {
      res.status(404).json({ success: false, message: 'ID tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data' });
  }
});
};
