var express = require('express');
var Article = require('../model/article');
var router = express.Router();
var ejs = require('ejs');
ejs.filters.formatHtml = function(html) {
  return html&&html.replace(/\r\n/gi, '<br/>') ;
};

router.param('id', function (req, res, next, id) {

  //在这里验证资料
  // ... ... ...

  //显示验证讯息
  console.log('doing id validations on ' + id);

  // 当验证成功时，将其储存至req
  req.id = id;

  // 继续后续的处理流程
  next();
});

router.get('/:id', function (req, res) {
  Article.detail(req.params.id, function (result) {
    res.render('detail', {data: result});
  });
});

module.exports = router;
