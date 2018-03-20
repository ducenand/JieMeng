const puppeteer = require('puppeteer');
const {jmConfig} = require('./config/index');
const sandClass = require('./sandClass');

(async () => {
    // {headless: false}
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(jmConfig.url);
    console.log(`go to ${jmConfig.url}`);
    let classes = await page.evaluate(() => {
        console.log('page loading done, start fetch...');
        const selected = document.querySelectorAll('.intro_tab a');
        return Array.prototype.map.call(selected, s => {
            return {text:s.innerHTML,href:s.href}
        });
    });

    if(classes && classes.length !== 0) {
        classes.shift();
        classes = classes.map((x)=>{
            let arr =  /^<span>(.*)\(.*\)<\/span>$/i.exec(x.text);
            if(!arr) {
                return x;
            }
            return {
                text: arr[1],
                href: x.href,
                gid: jmConfig.gid
            };

        });

        console.log('get class start submit mysql');
        console.log(classes);

        const Class = new sandClass(classes);
        Class.start();

        await browser.close();


    }else{
        throw Error(`get class error ${classes}`);
    }






    // page.on('load', async () => {
    //     console.log('page loading done, start fetch...');
    //
    //
    //
    // });

    // await page.setViewport({
    //     width: 1920,
    //     height: 1680
    // });
    // console.log('reset viewport');
    //
    // // await page.focus('#kw');
    // // await page.keyboard.sendCharacter('狗');
    // // const inputElement = await page.$('input[type=submit]');
    // // await inputElement.click();
    //
    // const elementHandle = await page.$('#kw');
    // await elementHandle.type('狗');
    // await elementHandle.press('Enter');
    //
    // console.log('go to search list');
    //
    // page.on('load', async () => {
    //     console.log('page loading done, start fetch...');
    //     const srcs = await page.evaluate(() => {
    //         const images = document.querySelectorAll('img.main_img');
    //         return Array.prototype.map.call(images, img => img.src);
    //     });
    //     console.log(`get ${srcs.length} images, start download`);
    //     srcs.forEach(async (src) => {
    //         // sleep
    //         await page.waitFor(200);
    //         await srcToImg(src, mn);
    //     });
    //
    //     await browser.close();
    //
    // });
})();