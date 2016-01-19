var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('page/single/index.html', {list: []});
});


module.exports = router;