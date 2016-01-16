var express = require('express');
var Article = require('../../model/article');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  if (req.session.visitCount) {
    req.session.visitCount++;
  } else {
    req.session.visitCount = 1;
  }
  console.log(req.session);
  Article.query(1, 20).then(function(result){
    res.render('page/news/index/index.tpl', {list: result});
  });
});

router.get('/:pageIndex/:pageSize', function (req, res) {
  var pageIndex = req.params.pageIndex;
  var pageSize = req.params.pageSize;
  console.log('--------pageIndex:' + pageIndex + ' pageSize:' + pageSize);
  Article.query(pageIndex, pageSize).then(function(result){
    res.render('page/news/index.tpl', {list: result});
  });
});

module.exports = router;