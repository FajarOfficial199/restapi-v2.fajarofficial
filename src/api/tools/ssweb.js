const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = function (app) {
async function screenshotV2(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
}
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
app.get('/tools/ssweb', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Masukkan URL. Contoh: /tools/ssweb?url=https://example.com" });
    }

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "URL tidak valid!" });
    }

    try {
        const imageBuffer = await screenshotV2(url);
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil screenshot." });
    }
});
}
