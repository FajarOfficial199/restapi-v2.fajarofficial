const danz = require("d-scrape");

const dev = "Fajar Official"; // Ganti dengan nama developer Anda

const messages = {
  error: {
    status: 500,
    developer: dev,
    result: "Error, Service Unavailable",
  },
  query: {
    status: 400,
    developer: dev,
    result: "Error, query parameter is required",
  },
  notRes: {
    status: 404,
    developer: dev,
    result: "Error, no response from AI",
  },
};

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
};
