var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('page/work/work.html', {list: []});
});


module.exports = router;