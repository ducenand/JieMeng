const query = require('./helper/mysql');
const puppeteer = require('puppeteer');

class Keywords{

    constructor(keywords) {
        this.keywords = keywords;
        this.fetchArray = [];
    }

    start(index=0) {
        console.log(index);
        if(this.keywords[index]){
            let obj = this.keywords[index];
            query(
                'INSERT INTO keywords (gid,keyword,cid,href) value (?,?,?,?)',
                [obj.gid,obj.keyword,obj.cid,obj.href])
                .then((results, fields)=>{
                    if(results.insertId) {
                        index++;
                        this.start(index);
                    }

                    // console.log(results.insertId);
                    // this.gotoPage(obj.href);
                    // console.log(results);
                    // console.log(fields);

                });


        }




        // for(let obj of this.keywords) {
        //     // const {html,href} = obj;
        //     this.fetchArray.push(this.saveData(obj));
        // }
        //
        //
        // Promise
        //     .all(this.fetchArray)
        //     .then((pages)=>{
        //         console.log(pages);
        //     });



    }

    saveData(obj) {
        return new Promise((resolve,reject)=>{
            query(
                'INSERT INTO keywords (gid,keyword,cid) value (?,?,?)',
                [obj.gid,obj.keyword,obj.cid])
                .then((results, fields)=>{

                    console.log(results.insertId);
                    // this.gotoPage(obj.href);
                    // console.log(results);
                    // console.log(fields);

                })
        });

    }

    async gotoPage(href) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(href);
        console.log(`go to ${href}`);

        let keywords = await page.evaluate(() => {
            console.log('page loading done, start fetch...');
            const selected = document.querySelectorAll('.intro_tab_cont li a');
            return Array.prototype.map.call(selected, s => {
                return {text:s.innerHTML,href:s.href}
            });
        });



        console.log(keywords);



    };






}

// const C = new Classes([{
//     text:'身体器官',
//     href:'http://tools.2345.com/zhgjm/shentiqiguan.htm',
//     gid:1
// }]);

// C.start();

module.exports = Keywords;