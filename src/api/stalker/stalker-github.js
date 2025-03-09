const axios = require("axios")

module.exports = function (app) {
    app.get("/stalker/github", async (req, res) => {
        try {
            const username = req.query.username;
            if (!username) {
                return res.status(400).json({ error: "Masukkan parameter username" });
            }

            const response = await axios.get(`https://api.github.com/users/${username}`);
            const data = response.data;

            res.json({
                results: {
                username: data.login,
                name: data.name,
                bio: data.bio,
                followers: data.followers,
                following: data.following,
                public_repos: data.public_repos,
                avatar_url: data.avatar_url,
                github_url: data.html_url
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Gagal mengambil data dari GitHub" });
        }
    });
};