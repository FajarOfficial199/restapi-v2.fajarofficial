const axios = require("axios");
const crypto = require("crypto");

module.exports = function (app) {

    function md5(text) {
        return crypto.createHash("md5").update(text).digest("hex");
    }

    app.post("/api/topupku/profile", async (req, res) => {
        try {
            const { api_id, api_key } = req.body;

            const response = await axios.post(
                "https://topupku.com/api/profile",
                {
                    api_id,
                    api_key,
                    signature: md5(api_id + api_key)
                }
            );

            res.json(response.data);

        } catch (err) {
            res.status(500).json({
                error: err.response?.data || err.message
            });
        }
    });

};
