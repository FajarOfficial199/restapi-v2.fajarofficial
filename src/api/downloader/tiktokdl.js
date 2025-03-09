module.exports = function (app) {
  app.get("/downloader/tiktok", async (req, res) => {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL is required." });
    }

    try {
      const { tiktokdl } = require("tiktokdl");
      const data = await tiktokdl(url);
      if (!data) {
        return res.status(404).json({ error: "No data found." });
      }
      res.json({ status: true, result: data });
    } catch (e) {
      console.error("TikTok Downloader Error:", e);
      res.status(500).json({ error: "Internal server error." });
    }
  });
};