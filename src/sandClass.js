const query = require('./helper/mysql');
const puppeteer = require('puppeteer');
const Keywords = require('./keywords');


class Classes {

    constructor(classes) {
        this.classes = classes;
        this.fetchArray = [];
        this.index = 0;
    }

    start() {
        for (let obj of this.classes) {
            this.fetchArray.push(this.saveData(obj));
        }

        Promise
            .all(this.fetchArray)
            .then((pages) => {
                console.log(pages);
            });


    }

    saveData(obj) {
        return new Promise((resolve, reject) => {
            query(
                'INSERT INTO class (gid,name) value (?,?)',
                [obj.gid, obj.text])
                .then((results, fields) => {
                    if (results.insertId) {
                        obj.cid = results.insertId;
                        this.gotoPage(obj);
                    }
                })
        });

    }

    async gotoPage(obj) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(obj.href,{
            timeout: 0
        });
        console.log(`go to ${obj.href}`);

        let kws = await page.evaluate(() => {
            console.log('page loading done, start fetch...');
            let arr = [];
            const selected = document.querySelectorAll('.intro_tab_cont li a');

            Array.prototype.map.call(selected, s => {
                let obj = {};
                obj.keyword = s.innerHTML;
                obj.href = s.href;
                arr.push(obj);
            });
            const pages = document.querySelectorAll('.page a');

            let ps = [];
            Array.prototype.map.call(pages, p => {
                ps.push(p.href);
            });

            return {keywords: arr, pages: ps};
        });


        if (kws.keywords && kws.keywords.length !== 0) {
            let data = kws.keywords.map((x) => {

                return {
                    cid: obj.cid,
                    keyword: x.keyword,
                    href: x.href,
                    gid: obj.gid
                };

            });

            console.log('get keywords start submit mysql');

            const K = new Keywords(data);
            K.start();

            await browser.close();

            await this.gotoNextPage(kws.pages, obj);


        } else {
            throw Error(`get keyword error ${kws}`);
        }

    }


    gotoNextPage(pages, obj) {

        return new Promise(() => {

            if (pages.length > 1) {
                pages.shift();
                if (!pages[this.index]) {
                    this.index = 0;
                } else {
                    let index = this.index;
                    this.index++;
                    let href = pages[index];
                    console.log(`go to ${href}`);
                    this.gotoPage({
                        cid: obj.cid,
                        href: href,
                        gid: obj.gid
                    });

                }


            }


        })


    }


}

// const C = new Classes([
//     {
//         text: '身体器官',
//         href: 'http://tools.2345.com/zhgjm/shentiqiguan.htm',
//         gid: 1
//     },
//     {
//         text: '人物称谓',
//         href: 'http://tools.2345.com/zhgjm/chenwei.htm',
//         gid: 1
//     }
// ]);

// C.start();
// C.gotoPage({
//     cid:2,
//     text: '人物称谓',
//     href: 'http://tools.2345.com/zhgjm/chenwei.htm',
//     gid: 1
// });

module.exports = Classes;