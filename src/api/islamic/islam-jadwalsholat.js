const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
async function jadwalSholat(kota) {
  try {
    const { data } = await axios.get(`https://www.dream.co.id/jadwal-sholat/${kota}/`);
    const $ = cheerio.load(data);
    const rows = $(".table-index-jadwal tbody tr");
    const jadwal = [];

    rows.each((index, row) => {
      const cols = $(row).find("td");
      jadwal.push({
        subuh: $(cols[1]).text().trim(),
        duha: $(cols[2]).text().trim(),
        zuhur: $(cols[3]).text().trim(),
        asar: $(cols[4]).text().trim(),
        magrib: $(cols[5]).text().trim(),
        isya: $(cols[6]).text().trim(),
      });
    });

    return jadwal[0] || null;
  } catch (error) {
    throw new Error("Gagal mengambil data jadwal sholat");
  }
}

app.get("/islam/jadwalsholat", async (req, res) => {
  const { kota } = req.query;
  if (!kota) {
    return res.status(400).json({ status: false, message: "Masukkan nama kota. Contoh: /islam/jadwalsholat?kota=jakarta" });
  }

  try {
    const jadwal = await jadwalSholat(kota);
    if (!jadwal) {
      return res.status(404).json({ status: false, message: "Jadwal sholat tidak ditemukan untuk kota tersebut." });
    }

    res.json({
      status: true,
      kota: kota.toUpperCase(),
      jadwal: jadwal,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Terjadi kesalahan dalam mengambil data." });
  }
});
}
