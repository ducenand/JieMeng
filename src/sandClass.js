const query = require('./helper/mysql');
const puppeteer = require('puppeteer');
const Keywords = require('./keywords');


class Classes {

    constructor(classes) {
        this.classes = classes;
        this.fetchArray = [];
    }

    start() {
        for (let obj of this.classes) {
            // const {html,href} = obj;
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
                    // console.log(results.);
                })
        });

    }

    async gotoPage(obj) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(obj.href);
        console.log(`go to ${obj.href}`);

        let kws = await page.evaluate(() => {
            console.log('page loading done, start fetch...');
            let obj = {};
            const selected = document.querySelectorAll('.intro_tab_cont li a');
            Array.prototype.map.call(selected, s => {
                obj.keyword = s.innerHTML;
                obj.href = s.href;
            });
            // const pages = document.querySelector('.page a');


            // Array.prototype.map.call(pages, p => {
            //     // obj['pages'].href =
            // });



            return obj;
        });

        if (kws && kws.length !== 0) {
            kws = kws.map((x) => {

                return {
                    cid: obj.cid,
                    keyword: x.keyword,
                    href: x.href,
                    gid: obj.gid
                };

            });

            console.log('get keywords start submit mysql');
            // console.log(kws);

            const K = new Keywords(kws);
            K.start();

            await browser.close();


        } else {
            throw Error(`get keywords error ${kws}`);
        }


    };


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
//
// C.start();

module.exports = Classes;