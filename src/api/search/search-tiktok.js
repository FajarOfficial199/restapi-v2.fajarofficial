const axios = require('axios');

module.exports = function(app) {
  async function tiktokSearchVideo(query) {
  return new Promise(async (resolve, reject) => {
    axios("https://tikwm.com/api/feed/search", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        cookie: "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: {
        keywords: query,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
      method: "POST",
    }).then((res) => {
      resolve(res.data.data);
    }).catch(err => reject(err));
  });
}
    app.get('/search/tiktok', async (req, res) => {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Silakan berikan query pencarian. Contoh: /search/tiktok?username=christy+jkt48"
            });
        }

        try {
            const searchResults = await tiktokSearchVideo(username);

            if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
                return res.status(404).json({
                    error: "Not Found",
                    message: "Tidak ditemukan hasil untuk pencarian tersebut."
                });
            }

            const result = searchResults.videos.map((video, index) => ({
                no: index + 1,
                title: video.title || "Tidak tersedia",
                username: video.author?.unique_id || "Tidak tersedia",
                nickname: video.author?.nickname || "Tidak tersedia",
                duration: `${video.duration || 0} detik`,
                like: video.digg_count || 0,
                comment: video.comment_count || 0,
                share: video.share_count || 0,
                url: `https://www.tiktok.com/@${video.author?.unique_id}/video/${video.video_id}`,
                video_url: `https://tikwm.com${video.play}`
            }));

            res.json({
                status: true,
                searchQuery: username,
                totalResults: result.length,
                results: result
            });

        } catch (err) {
            console.error("Error saat mengambil data dari TikTok:", err);
            res.status(500).json({
                status: false,
                error: "Internal Server Error",
                message: `Terjadi kesalahan: ${err.message}`
            });
        }
    });
};