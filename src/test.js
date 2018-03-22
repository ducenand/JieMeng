const puppeteer = require('puppeteer');

(async ()=>{

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('http://www.baidu.com',{
        timeout: 0
    });

    await page.close();

    await page.goto('http://www.999d.com',{
        timeout: 0
    });





})();
