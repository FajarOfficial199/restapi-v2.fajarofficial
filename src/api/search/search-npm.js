const dylux = require("api-dylux");
const ytdl = require("ytdl-core")

module.exports = function (app) {
  app.get('/search/npmsearch', async (req, res, next) => {
    const text = req.query.package;

    if (!text) {
        return res.status(400).json({ error: 'Package tidak ditemukan dalam parameter' });
      }
    

    try {
      const data = await dylux.npmSearch(text);
      res.json({
        status: true,
        result: data
      });
    } catch (err) {
      // Sending an error message as a response
      res.status(500).json({
        status: false,
        message: 'An error occurred during the search',
        error: err.message || err
      });
    }
  });
};
