const SampQuery = require('samp-query');

async function getServerStatus(ip, port) {
    return new Promise((resolve, reject) => {
        const options = {
            host: ip,
            port: parseInt(port, 10),
            timeout: 3000
        };

        SampQuery(options, (error, response) => {
            if (error) {
                console.error("Error detail:", error);
                return reject(null);
            }

            if (!response) {
                return reject(null);
            }

            resolve({
                ip: options.host,
                port: options.port,
                hostname: response.hostname || "Tidak diketahui",
                players_online: response.online || 0,
                max_players: response.maxplayers || 0,
                gamemode: response.gamemode || "Tidak diketahui",
                map_name: response.mapname || "Tidak diketahui",
                version: response.rules?.version || "Tidak diketahui",
                weather: response.rules?.weather || "Tidak diketahui",
                web_url: response.rules?.weburl || "Tidak diketahui",
                world_time: response.rules?.worldtime || "Tidak diketahui",
                players: response.players?.map(player => player.name) || []
            });
        });
    });
}

module.exports = function(app) {
    app.get('/status/server/samp', async (req, res) => {
    const { ip, port } = req.query;


    try {
        const serverStatus = await getServerStatus(ip, port);

        if (serverStatus) {
    
            res.json({
                status: true,
                results: {
                    IPServer: serverStatus.ip,
                    PortServer: serverStatus.port,
                    NamaServer: serverStatus.hostname,
                    PemainOnline: serverStatus.players_online,
                    MaxPemain: serverStatus.max_players,
                    GameMode: serverStatus.gamemode,
                    Map: serverStatus.map_name,
                    Version: serverStatus.version,
                    Weather: serverStatus.weather,
                    Url: serverStatus.web_url,
                    Time: serverStatus.world_time,
                    Players: serverStatus.players
                }
            });
        } else {
            res.status(503).json({ status: false, message: "Server sedang offline/MT." });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ status: false, error: "Terjadi kesalahan saat menghubungi server." });
    }
});
}
