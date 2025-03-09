const util = require("minecraft-server-util");

module.exports = function(app) {
    app.get('/status/server/minecraft', async (req, res) => {
        const host = req.query.host;
        const port = parseInt(req.query.port) || 25565; // Default port Minecraft

        if (!host) {
            return res.status(400).json({
                status: false,
                message: "⚠️ Parameter 'host' diperlukan. Contoh: /status/server/minecraft?host=example.com&port=25565"
            });
        }

        try {
            const data = await util.status(host, port, { timeout: 5000 });

            res.json({
                status: true,
                results: {
                    ip: host,
                    port: port,
                    ping: data.roundTripLatency || "N/A",
                    motd: data.motd?.clean || "Tidak tersedia",
                    online: data.players?.online || 0,
                    max: data.players?.max || 0,
                    version: data.version?.name || "Tidak tersedia",
                    protocol: {
                        version: data.version?.protocol || "N/A",
                        name: data.version?.name || "N/A"
                    },
                    players: data.players?.sample || [],
                    software: data.software || "Unknown",
                    hostname: data.srvRecord?.host || "N/A",
                    debug: {
                        query: data.query || false,
                        srv: !!data.srvRecord,
                        cachehit: !!data.favicon
                    }
                }
            });

        } catch (error) {
            console.error("Error saat mengambil data server Minecraft:", error);
            res.status(500).json({
                status: false,
                message: "Gagal mendapatkan data server Minecraft. Pastikan server online dan host benar.",
                error: error.message
            });
        }
    });
};