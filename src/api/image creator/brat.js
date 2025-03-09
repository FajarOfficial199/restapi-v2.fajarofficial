const { chromium } = require("playwright");
const sharp = require("sharp");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = function (app) {
    app.get("/image/brat", async (req, res) => {
        const text = req.query.text;
        if (!text) {
            return res.status(400).json({ result: false, message: "Harap berikan teks melalui parameter ?text=" });
        }

        let browser;
        try {
            browser = await chromium.launch({ headless: true });
            const context = await browser.newContext({
                viewport: { width: 375, height: 812 },
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
            });

            const page = await context.newPage();
            await page.goto("https://www.bratgenerator.com/", { waitUntil: "networkidle", timeout: 30000 });

            // Setup theme (jika diperlukan)
            await page.evaluate(() => {
                if (typeof setupTheme === "function") setupTheme("white");
            });

            await page.waitForSelector("#textInput", { timeout: 10000 });

            // Input teks ke dalam generator
            await page.evaluate((text) => {
                const inputField = document.querySelector("#textInput");
                if (!inputField) throw new Error("Elemen #textInput tidak ditemukan");
                inputField.value = text;
                inputField.dispatchEvent(new Event("input"));
            }, text);

            await page.waitForTimeout(1000);

            // Ambil screenshot area yang diinginkan
            const screenshotBuffer = await page.screenshot({
                clip: { x: 0, y: 220, width: 375, height: 375 },
            });

            // Resize dan konversi ke WebP
            const resizedImage = await sharp(screenshotBuffer)
                .resize(512, 512)
                .webp()
                .toBuffer();

            // Buat stiker
            const sticker = new Sticker(resizedImage, {
                pack: "Brat Generator",
                author: "Bot",
                type: StickerTypes.FULL,
                quality: 90,
            });

            const stickerBuffer = await sticker.toBuffer();

            res.setHeader("Content-Type", "image/webp");
            res.send(stickerBuffer);
        } catch (error) {
            res.status(500).json({ result: false, message: "Terjadi kesalahan: " + error.message });
        } finally {
            if (browser) await browser.close();
        }
    });
};