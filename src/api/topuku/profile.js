const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
module.exports = function (app) {
  function md5(text) {
    return crypto.createHash("md5").update(text).digest("hex");
}
app.get("/api/topupku/profile", async (req, res) => {
    try {
      const { api_id, api_key } = req.body
        const response = await axios.post(
            "https://topupku.com/api/profile",
            {
                api_id: api_id,
                api_key: api_key,
                signature: md5(API_ID + API_KEY)
            }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
}
