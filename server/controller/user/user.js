var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Encrypt = require('../utils/encrypt');

router.get('/login', function(req, res) {
  res.render('login');
});

/*
req.params.xxxxx 从path中的变量
req.query.xxxxx 从get中的?xxxx=中
req.body.xxxxx 从post中的变量
*/
router.post('/dologin', function(req, res) {
  console.log(JSON.stringify(req.body));
  var username = req.body.username;
  var password=req.body.password;
  var encryptPassword = Encrypt.md5(password).toUpperCase();
  console.log('>>>encryptPassword:' + encryptPassword);
  User.loginByEmail(username, encryptPassword, function(status, userInfo){
    if(status == message.login.success){
      req.session.user = user;
      res.redirect('/')
    }else{
      res.send('登陆失败');
    }
  })
});

module.exports = router;
