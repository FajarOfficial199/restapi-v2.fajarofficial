const fetch = require("node-fetch");

module.exports = function(app) {
    const niatShalatRoutes = [
        { path: "/api/islam/niatmaghrib", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatMaghrib.json" },
        { path: "/api/islam/niatisya", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatIsya.json" },
        { path: "/api/islam/niatashar", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatAshar.json" },
        { path: "/api/islam/niatsubuh", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatShubuh.json" },
        { path: "/api/islam/niatdzuhur", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatDzuhur.json" },
        { path: "/api/islam/niatshalat", url: "https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/dataNiatShalat.json" }
    ];

    niatShalatRoutes.forEach(route => {
        app.get(route.path, async (req, res) => {
            try {
                const response = await fetch(route.url);
                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.statusText}`);
                }
                const data = await response.json();
                res.json({ status: true, result: data });
            } catch (error) {
                console.error(`Error pada ${route.path}:`, error);
                res.status(500).json({ status: false, message: "Terjadi kesalahan saat mengambil data.", error: error.message });
            }
        });
    });
};