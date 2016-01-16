var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('test/index', { title: 'express fis3 swig' });
});

module.exports = router;
