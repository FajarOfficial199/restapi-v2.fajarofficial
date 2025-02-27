const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
  async function tiktokStalk(username) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${username}`);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        const parsedData = JSON.parse(scriptData);

        const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        if (!userDetail) {
            throw new Error('User tidak ditemukan');
        }

        const userInfo = userDetail.userInfo?.user;
        const stats = userDetail.userInfo?.stats;

        const metadata = {
            userInfo: {
                id: userInfo?.id || null,
                username: userInfo?.uniqueId || null,
                nama: userInfo?.nickname || null,
                avatar: userInfo?.avatarLarger || null,
                bio: userInfo?.signature || null,
                verifikasi: userInfo?.verified || false,
                totalfollowers: stats?.followerCount || 0,
                totalmengikuti: stats?.followingCount || 0,
                totaldisukai: stats?.heart || 0,
                totalvideo: stats?.videoCount || 0,
                totalteman: stats?.friendCount || 0,
            }
        };

        return JSON.stringify(metadata, null, 2);
    } catch (error) {
        return JSON.stringify({ error: error.message });
    }
}
  app.get('/stalker/tiktok', async (req, res) => {
    const username = req.query.username;
    
    if (!username) {
        return res.status(400).json({
            Status: false,
            Message: 'Parameter username diperlukan!',
        });
    }

    try {
        const results = await tiktokStalk(username);
        res.json({
            Status: true,
            results: JSON.parse(results),
        });
    } catch (error) {
        res.status(500).json({
            Status: false,
            Message: 'Terjadi kesalahan pada server',
            Error: error.message,
        });
    }
});
}