var express = require("express");
var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.use(express.static('assets'))

app.get("/doc", (req, res, next) => {
    const puppeteer = require('puppeteer')
 
    async function printPDF() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/devis/', {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();
    return pdf
    };

    printPDF().then(pdf => {
        console.log("cooucou")
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
    });
});