const puppeteer = require('puppeteer');
const query = require('./helper/mysql');

class Details{

    constructor(){

        // 取keywords数据，如果中间有中断limit可以修改到中断的位置，继续开始
        this.sql = "SELECT * from keywords LIMIT 0,50000";
        this.addsql = "INSERT INTO details (cid,gid,kid,detail) value (?,?,?,?)";
        this.fetchArray = [];
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
                const selected = document.querySelectorAll('.dream_detail p');
                return Array.prototype.map.call(selected, s => {
                    return s.innerHTML;
                });

            });
            if(dreamDetail && dreamDetail.length>0) {
                if(!dreamDetail[0]){
                    dreamDetail.shift();
                }
                if(!dreamDetail[dreamDetail.length-1]){
                    dreamDetail.pop();
                }

                dreamDetail = dreamDetail.map((x) => {
                    return x.trim();
                });
            }

            for (let v of dreamDetail) {
                this.fetchArray.push(this.saveToPromise(v,data));
            }

            Promise
                .all(this.fetchArray)
                .then((pages) => {
                    console.log(pages);
                    this.index++;
                    console.log(this.index);
                    browser.close();
                    this.fetchArray = [];
                    this.gotoPage();
                });
        } else {
            console.log('----end----');
            await browser.close();
        }



    }

    saveToPromise(v,data) {
        // cid,gid,kid,detail
        return new Promise((resolve,reject)=>{
            query(this.addsql,[data.cid,data.gid,data.kid,v]).then((results, fields)=>{
                console.log(results.insertId);
                resolve(results.insertId);
            });


        });

    }


}

const D = new Details();
D.start();