const express = require("express");
const fs = require("fs");
const cors = require("cors"); 
const scrapeExchangeRates = require("./scraper");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static("public"));

app.get("/api/exchange-rates", (req, res) => {
    try {
        const data = fs.readFileSync("data.json", "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: "Failed to load exchange rates" });
    }
});

setInterval(scrapeExchangeRates, 60 * 60 * 1000); 

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    scrapeExchangeRates(); 
});
