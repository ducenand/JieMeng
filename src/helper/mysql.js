const mysql = require('mysql');
const mysql_config = require('../config/mysql.config');
const pool = mysql.createPool(mysql_config);

const query = (sql, options) => {
    return new Promise((resolve, reject) => {

        pool.getConnection((error, connection) => {

            if (error) {
                throw Error(error);
                return;
            }
            connection.query(sql, options, (err, results, fields) => {
                if (!err) {
                    resolve(results, fields);
                    connection.release();
                } else {
                    throw Error(`sql error at mysql.js con.query ${err}`);
                    reject(err);
                }

            });

        });

    });

};

module.exports = query;
// query(
//     'INSERT INTO class (gid,name) value (?,?)',
//     [1,'hello'])
//     .then((results, fields)=>{
//         console.log(results);
//         console.log(fields);
//
//     })



