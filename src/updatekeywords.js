const puppeteer = require('puppeteer');
const query = require('./helper/mysql');

class Details{
    constructor(){
        // 取keywords数据，如果中间有中断limit可以修改到中断的位置，继续开始
        this.sql = "SELECT * from keywords where cid = 52";
        this.upsql = "UPDATE keywords SET keyword=? WHERE kid = ? ";
        this.index = 0;
        this.results = null;
    }


    start() {
        query(this.sql,[]).then((results, fields)=> {
            if (results && results.length > 0) {
                console.log(results);
                this.results = results;
                this.gotoPage();
            }
        })

    };

    async gotoPage() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        let index = this.index;
        let data = this.results[index];
        console.log(index);
        if(data){

            await page.goto(data.href,{
                timeout: 0
            });
            console.log(`go to ${data.href}`);

            let dreamDetail = await page.evaluate(()=>{
                const title = document.querySelector('.art_title').innerHTML;
                return title;
            });
            console.log(dreamDetail);


            if(dreamDetail) {
                let t = dreamDetail.replace('【','').replace('】','');

                query(this.upsql,[t,data.kid]).then((results, fields)=>{
                    this.index++;
                    browser.close();
                    this.gotoPage();

                });

            }

        } else {
            console.log('----end----');
            await browser.close();
        }



    }



}

const D = new Details();
D.start();