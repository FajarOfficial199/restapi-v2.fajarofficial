const axios = require("axios");

module.exports = function(app) {
async function fetchBlackboxAI(prompt) {
    const url = "https://www.blackbox.ai/api/chat";
    const headers = {
        "authority": "www.blackbox.ai",
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "origin": "https://www.blackbox.ai",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
    };

    const data = {
        "messages": [{ "role": "user", "content": prompt, "id": "54lcaEJ" }],
        "agentMode": {},
        "id": "RDyqb0u",
        "previewToken": null,
        "userId": null,
        "codeModelMode": true,
        "trendingAgentMode": {},
        "isMicMode": false,
        "userSystemPrompt": null,
        "maxTokens": 1024,
        "playgroundTopP": null,
        "playgroundTemperature": null,
        "isChromeExt": false,
        "githubToken": "",
        "clickedAnswer2": false,
        "clickedAnswer3": false,
        "clickedForceWebSearch": false,
        "visitFromDelta": false,
        "isMemoryEnabled": false,
        "mobileClient": false,
        "userSelectedModel": null,
        "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
        "imageGenerationMode": true,
        "webSearchModePrompt": true,
        "deepSearchMode": false,
        "domains": null,
        "vscodeClient": false,
        "codeInterpreterMode": false,
        "customProfile": {
            "name": "",
            "occupation": "",
            "traits": [],
            "additionalInfo": "",
            "enableNewChats": false
        },
        "session": null,
        "isPremium": false,
        "subscriptionCache": null,
        "beastMode": false
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching Blackbox AI response:", error);
        return { error: "Terjadi kesalahan saat mengambil data dari Blackbox AI." };
    }
}

app.get("/ai/blackbox", async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Masukkan prompt untuk Blackbox AI!" });
    }

    try {
        const result = await fetchBlackboxAI(prompt);

        // Format respons agar lebih rapi
        if (result.messages) {
            return res.json({
                prompt: prompt,
                response: result.messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content
                }))
            });
        }

        res.json({ error: "Tidak ada respons dari Blackbox AI." });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan dalam memproses permintaan." });
    }
});
}
