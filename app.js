var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var resourceMap = require('./server/middleware/resource.js');
var swigView = require('./server/lib/swig/view/index.js');

// 启动express
var app = express();

//设置视图模板的默认后缀名为tpl
app.set('view engine', 'html');

//设置模板文件文件夹,__dirname为全局变量,表示网站根目录
app.set('views', path.join(__dirname, '/view'));

//设置自定义swig view引擎
app.engine('.html', swigView.init({}, app));


//var swig = require('swig');
//var swigObj = new swig.Swig();
//app.engine('.tpl', swigObj.renderFile);

//初始化map资源依赖
app.use(resourceMap({root: __dirname, prefix: '/'}));

app.use(favicon());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '123456',
    cookie: { maxAge: 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, '/')));

app.get('/',function(req,res){
    res.redirect('/work');
});

app.use('/single', require('./server/controller/single/index.js'));
app.use('/work', require('./server/controller/work/index.js'));


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('widget/error/error.html', {
        message: err.message,
        error: err.status
    });
});


var server = app.listen(app.get('port')||9000, function() {
    console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
