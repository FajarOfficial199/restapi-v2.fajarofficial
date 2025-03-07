const danz = require("d-scrape");

module.exports = function (app) {
app.get("/ai/chatgpt", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json(messages.query);

  try {
    const data = await danz.ai.ChatGpt(query);
    if (!data) return res.status(404).json(messages.notRes);
    res.json({
      status: true,
      developer: dev,
      result: {
        message: data,
      },
    });
  } catch (e) {
    res.status(500).json(messages.error);
  }
});
}
