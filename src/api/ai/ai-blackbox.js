const axios = require("axios");

module.exports = function(app) {
async function fetchBlackboxAI(prompt) {
        const url = "https://www.blackbox.ai/api/chat";
        const headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
        };

        const data = {
            messages: [{ role: "user", content: prompt }],
            agentMode: {},
            maxTokens: 1024
        };

        try {
            const response = await axios.post(url, data, { headers });

            if (response.data && response.data.messages) {
                return response.data.messages;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching Blackbox AI:", error);
            return null;
        }
}

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

        const result = await fetchBlackboxAI(prompt);

        if (result) {
            res.json({
                status: "success",
                prompt: prompt,
                response: result.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }))
            });
        } else {
            res.json({ creator: "Fajar Official", error: "Gagal mendapatkan respons dari Blackbox AI." });
        }
    });
}
