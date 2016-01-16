var response = require('./lib/response.js');
var layer = require('./lib/layer.js');
var combine = require('./lib/combine.js');
var utils = require('./lib/util.js');


exports.init = function(settings, app) {
    var Engine;

    if (arguments.length === 1) {
        app = settings;
        settings = {};
    }

    // 让 response.render 的时候，将 response 实例作为 locals 参数携带进来。
    hackResponse(app);

    settings.views = app.get('views');

    Engine = utils.resolveEngine(settings.engine || 'engine');

    return function(filepath, locals, done) {

        console.log('>>>filePath:' +filepath);
        // 关于 response 来源，请查看 hackResponse 方法,以及 lib/reponse.js
        var res = locals.response;

        // 创建一个新对象。
        var options = utils.mixin({}, settings);
        //console.log('>>>>>settings:' + JSON.stringify(settings) );

        // 初始化 layer 层。
        // 提供 addScript, addStyle, resolve, addPagelet 各种接口。
        // 用来扩展模板层能力。
        var prototols = layer(res, settings);

        var sentData = false;

        //console.log('>>>>>options:' + JSON.stringify(options) + ' prototols:' + JSON.stringify(prototols));

        //console.log('>>>engine local %o', locals);

        new Engine(options, prototols)

            .makeStream(filepath, utils.mixin(locals, {fiswig: prototols}))

            // 合并 tpl 流 和 bigpipe 流。
            .pipe(combine(prototols))

            .on('data', function() {
                sentData = true;
            })

            .on('error', function(error) {
                // 属于 chunk error
                if (sentData) {
                    if (typeof settings.chunkErrorHandler === 'function') {
                        settings.chunkErrorHandler(error, res);
                    } else {
                        res.write('<script>window.console && console.error("chunk error", "'+ error.message.replace(/"/g, "\\\"") +'")</script>');
                    }
                    res.end();
                } else {
                    // 交给 express 去处理错误吧。
                    done(error);
                }
            })

            // 直接输出到 response.
            .pipe(res);
    };
};

// hack into response class.
var hacked = false;
function hackResponse(app) {
    if (hacked) return;
    hacked = true;

    app.use(function hackResponse(req, res, next) {
        var origin = res.__proto__;
        response.__proto__ = origin;
        res.__proto__ = response;
        origin = null;

        next();
    });
}