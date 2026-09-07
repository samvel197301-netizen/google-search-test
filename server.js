const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

function formatResults(data) {
    return (data.organic_results || []).map(result => ({
        position: result.position,
        title: result.title,
        url: result.link,
        description: result.snippet || ""
    }));
}

app.get("/api/search", async (req, res) => {
    const query = req.query.q;

    if (!query || !query.trim()) {
        return res.status(400).json({
            error: "Chybí vyhledávací dotaz"
        });
    }

    try {
        const url =
            `https://serpapi.com/search.json` +
            `?engine=google` +
            `&q=${encodeURIComponent(query)}` +
            `&api_key=${process.env.SERPAPI_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return res.status(500).json({
                error: data.error
            });
        }

        const results = formatResults(data);

        res.json(results);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Nepodařilo se získat výsledky"
        });
    }
});

module.exports = { formatResults };

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});