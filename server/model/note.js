//https://github.com/felixge/node-mysql
var MySQLUtil = require('../utils/mysql');
exports.query = function (callback) {
  MySQLUtil.query('select id,title,createDate,hits from smart_user_note', [], function (rows, fields) {
    console.log('rows', JSON.stringify(rows));
    //console.log('fields', JSON.stringify(fields));
    callback(rows);
  });
};

exports.detail = function (id, callback) {
  MySQLUtil.query('select id,title,content,createDate,hits from smart_user_note where id=?',[id], function (rows, fields) {
    console.log('rows', JSON.stringify(rows));
    callback(rows.length>0 ? rows[0]:{});
  });
};

exports.insert = function (json, callback) {
  //var json  = {id: 1, title: 'node.js express'};
  MySQLUtil.query('INSERT INTO posts SET',json, function (rows, fields) {
    console.log('rows', JSON.stringify(rows));
    callback(rows);
  });
};