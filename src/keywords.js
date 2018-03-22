const query = require('./helper/mysql');

class Keywords{

    constructor(keywords) {
        this.keywords = keywords;
        this.fetchArray = [];
    }

    start(index=0) {
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

                });

        }

    }


}

// const C = new Classes([{
//     text:'身体器官',
//     href:'http://tools.2345.com/zhgjm/shentiqiguan.htm',
//     gid:1
// }]);

// C.start();

module.exports = Keywords;