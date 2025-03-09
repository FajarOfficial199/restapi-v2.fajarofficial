const dylux = require("api-dylux");

module.exports = function (app) {
  app.get('/search/xnxxsearch', async (req, res, next) => {
    const query = req.query.query;
    
    if (!query) {
      return res.json({ status: false, message: "[!] Enter query parameter!" });
    }

    try {
      const data = await dylux.xnxxSearch(query);
      
      if (!data || !data.result) {
        return res.json({ status: false, message: "[!] No results found." });
      }

      const result = data.result;
      res.json({
        status: true,
        result: result
      });
    } catch (err) {
      console.error(err);  // Log the error for debugging purposes
      res.status(500).json({ status: false, message: "An error occurred, please try again later." });
    }
  });
};
