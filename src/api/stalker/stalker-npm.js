const axios = require('axios');

module.exports = function(app) {
  async function npmstalk(packageName) {
  try {
    let stalk = await axios.get("https://registry.npmjs.org/" + packageName);
    let versions = stalk.data.versions;
    let allver = Object.keys(versions);
    let verLatest = allver[allver.length - 1];
    let verPublish = allver[0];
    let packageLatest = versions[verLatest];
    
    return {
      name: packageName,
      versionLatest: verLatest,
      versionPublish: verPublish,
      versionUpdate: allver.length,
      latestDependencies: Object.keys(packageLatest.dependencies || {}).length,
      publishDependencies: Object.keys(versions[verPublish].dependencies || {}).length,
      publishTime: stalk.data.time.created,
      latestPublishTime: stalk.data.time[verLatest]
    };
  } catch (err) {
    throw new Error('Gagal mengambil data dari NPM');
  }
}
    app.get('/stalker/npm', async (req, res) => {
        const text = req.query.package;

        if (!text) {
            return res.status(400).json({
                status: false,
                message: "⚠️ Gunakan dengan contoh: ?package=axios"
            });
        }

        try {
            const npmInfo = await npmstalk(text);

            if (!npmInfo || !npmInfo.name) {
                return res.status(404).json({
                    status: false,
                    message: "❌ Paket tidak ditemukan di NPM. Pastikan nama paket benar!"
                });
            }

            res.json({
                status: true,
                results: {
                    Package: npmInfo.name || "Tidak tersedia",
                    VersiTerbaru: npmInfo.versionLatest || "Tidak tersedia",
                    WaktuTerbit: npmInfo.publishTime || "Tidak tersedia",
                    DependenciesTerbaru: npmInfo.latestDependencies || "Tidak tersedia"
                }
            });

        } catch (err) {
            console.error("Error saat mengambil data dari NPM:", err);
            return res.status(500).json({
                status: false,
                message: "❌ Ada masalah saat mengambil data dari NPM. Coba lagi nanti ya 🥺",
                error: err.message
            });
        }
    });
};