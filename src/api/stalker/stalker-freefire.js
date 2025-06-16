const { uid } = require('free-fire-apis');

module.exports = function (app) {
  app.get('/api/check-nickname', async (req, res) => {
    const { playerId } = req.query; // GET request pakai req.query

    if (!playerId) {
      return res.status(400).json({ success: false, message: 'Parameter playerId wajib diisi' });
    }

    try {
      const data = await uid(playerId);
      if (data && data.Nickname) {
        res.json({
          success: true,
          nickname: data.Nickname,
          region: data.Region || null,
        });
      } else {
        res.status(404).json({ success: false, message: 'ID tidak ditemukan' });
      }
    } catch (err) {
      console.error('Error saat memeriksa nickname:', err);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil data' });
    }
  });
};
