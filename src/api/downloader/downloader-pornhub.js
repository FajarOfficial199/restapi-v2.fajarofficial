const puppeteer = require("puppeteer");

module.exports = function (app) {
app.get("/downloader/pornhub", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(videoUrl, { waitUntil: "networkidle2" });

        // Scrape video URL
        const videoSrc = await page.evaluate(() => {
            const videoElement = document.querySelector("video");
            return videoElement ? videoElement.src : null;
        });

        await browser.close();

        if (videoSrc) {
            res.json({ success: true, download_url: videoSrc });
        } else {
            res.status(404).json({ error: "Video URL not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video", details: error.message });
    }
});
}
