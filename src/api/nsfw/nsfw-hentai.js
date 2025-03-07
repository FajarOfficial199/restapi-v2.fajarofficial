const fetch = require("node-fetch"); // Hanya diperlukan jika menggunakan Node.js sebelum v18

module.exports = function (app) {
  app.get("/nsfw/hentai", async (req, res) => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/jepribarus/JB-Api/main/nsfw/hentai.json"
      );
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        return res.status(404).json({ status: false, error: "No data found" });
      }

      const result = data[Math.floor(Math.random() * data.length)];
      res.json({ status: true, result });
    } catch (e) {
      res.status(500).json({ status: false, error: e.message });
    }
  });
};
