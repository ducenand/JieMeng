const puppeteer = require('puppeteer');
const {jmConfig} = require('./config/index');
const sandClass = require('./sandClass');

(async () => {
    // {headless: false}
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(jmConfig.url,{
        timeout: 0
    });
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

        console.log('class start submit mysql');
        console.log(classes);

        const Class = new sandClass(classes);
        Class.start();
        await browser.close();

    }else{
        //针对没有类目的分类如：孕妇解梦
        classes = [{
            text: '全部',
            href: jmConfig.url,
            gid: jmConfig.gid
        }];

        console.log(classes);
        const Class = new sandClass(classes);
        Class.start();

        await browser.close();

        // throw Error(`get class error ${classes}`);
    }

})();