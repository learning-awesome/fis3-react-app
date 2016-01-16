var MySQLUtil = require('../utils/mysql');

exports.loginByEmail = function (email, password, callback) {
  MySQLUtil.query('select id, nickname, email, password, qq, mobile, roleId, createDate, status from smart_user_info where email=?', [email],
    function (rows, fields) {
      console.log('rows', JSON.stringify(rows));
      if(rows && rows.length>0){
        var row = rows[0];
        if(row.password == password){// 登陆成功
          callback(message.login.success, row);
        }else{// 密码错误
          callback(message.login.pwd.error, null);
        }
      }else{
        callback(message.login.none, null);
      }
    });
};


exports.insert = function (json, callback) {
  //var json  = {id: 1, title: 'node.js express'};
  MySQLUtil.query('INSERT INTO posts SET', json, function (rows, fields) {
    console.log('rows', JSON.stringify(rows));
    callback(rows);
  });
};