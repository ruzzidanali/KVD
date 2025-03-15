const puppeteer = require("puppeteer");
const fs = require("fs");

const currencyMapping = {
    "US Dollar": { country: "United States", flag: "https://flagpedia.net/data/flags/h80/us.png" },
    "Singapore Dollar": { country: "Singapore", flag: "https://flagpedia.net/data/flags/h80/sg.png" },
    "New Zealand Dollar": { country: "New Zealand", flag: "https://flagpedia.net/data/flags/h80/nz.png" },
    "Pound Sterling": { country: "United Kingdom", flag: "https://flagpedia.net/data/flags/h80/gb.png" },
    "The Euro": { country: "Eurozone", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/320px-Flag_of_Europe.svg.png" },
    "Canadian Dollar": { country: "Canada", flag: "https://flagpedia.net/data/flags/h80/ca.png" },
    "Brunei Dollar": { country: "Brunei", flag: "https://flagpedia.net/data/flags/h80/bn.png" },
    "Australian Dollar": { country: "Australia", flag: "https://flagpedia.net/data/flags/h80/au.png" },
    "UAE Dirham": { country: "United Arab Emirates", flag: "https://flagpedia.net/data/flags/h80/ae.png" },
    "Swiss Franc": { country: "Switzerland", flag: "https://flagpedia.net/data/flags/h80/ch.png" },
    "Chinese Renminbi": { country: "China", flag: "https://flagpedia.net/data/flags/h80/cn.png" },
    "Danish Kroner": { country: "Denmark", flag: "https://flagpedia.net/data/flags/h80/dk.png" },
    "Hong Kong Dollar": { country: "Hong Kong", flag: "https://flagpedia.net/data/flags/h80/hk.png" },
    "Indonesian Rupiah": { country: "Indonesia", flag: "https://flagpedia.net/data/flags/h80/id.png" },
    "Philippine Peso": { country: "Philippines", flag: "https://flagpedia.net/data/flags/h80/ph.png" },
    "Indian Rupee": { country: "India", flag: "https://flagpedia.net/data/flags/h80/in.png" },
    "Japanese Yen": { country: "Japan", flag: "https://flagpedia.net/data/flags/h80/jp.png" },
    "Sri Lanka Rupee": { country: "Sri Lanka", flag: "https://flagpedia.net/data/flags/h80/lk.png" },
    "Norwegian Kroner": { country: "Norway", flag: "https://flagpedia.net/data/flags/h80/no.png" },
    "Saudi Arabia Riyal": { country: "Saudi Arabia", flag: "https://flagpedia.net/data/flags/h80/sa.png" },
    "Swedish Kroner": { country: "Sweden", flag: "https://flagpedia.net/data/flags/h80/se.png" },
    "Thai Baht": { country: "Thailand", flag: "https://flagpedia.net/data/flags/h80/th.png" },
    "South African Rand": { country: "South Africa", flag: "https://flagpedia.net/data/flags/h80/za.png" },
    "Gold": { country: "Gold", flag: "https://img.icons8.com/?size=100&id=20043&format=png&color=000000" }
};


const URL = "https://www.hsbc.com.my/investments/products/foreign-exchange/currency-rate/";




async function scrapeExchangeRates() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 0 });

    try {
        await page.waitForFunction(() => {
            const rows = document.querySelectorAll("table tbody tr");
            return rows.length > 0 && rows[0].querySelectorAll("td").length > 1;  
        }, { timeout: 15000 }); 
    } catch (error) {
        console.error("❌ Data not loaded in table! Try increasing the wait time.");
        await browser.close();
        return;
    }

    const exchangeRates = await page.evaluate((currencyMapping) => {
        const rows = document.querySelectorAll("table tbody tr");
        let data = [];

        rows.forEach((row) => {
            const columns = row.querySelectorAll("td");

            if (columns.length >= 3) {
                const currency = columns[0]?.innerText?.trim() || "Unknown";
                console.log("Detected currency:", currency);
                const countryData = currencyMapping[currency] || { country: "Unknown", flag: "" };
                console.log("Matched country and flag:", countryData);
                const sellRate = columns[1]?.innerText?.trim() || "N/A";
                const buyRate = columns[2]?.innerText?.trim() || "N/A";

                data.push({
                    country: countryData.country,
                    flag: countryData.flag,
                    sellRate,
                    buyRate,
                });
            }
        });

        return data;
    }, currencyMapping);

    await browser.close();

    if (exchangeRates.length === 0) {
        console.error("❌ No data extracted. The website may have further protections.");
    } else {
        console.log("✅ Exchange rates extracted successfully!");
    }

    const result = {
        lastUpdated: new Date().toISOString(),
        exchangeRates,
    };

    fs.writeFileSync("data.json", JSON.stringify(result, null, 2));
    console.log("✅ Exchange rates updated:", result.lastUpdated);
}

module.exports = scrapeExchangeRates;
