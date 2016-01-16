/**
 * 此插件为 swig-view 的 swig 版本显现。
 */
var Readable = require('stream').Readable;
var util = require('util');
var Swig = require('swig').Swig;
var loader = require('./lib/loader.js');
var tags  = [
    "script",
    "style",
    "html",
    "body",
    "require",
    "uri",
    "widget",
    "head",
    "feature",
    "featureelse",
    "spage"
];
var swigInstance;

/**
 * Opitions 说明
 * - `views` 模板根目录
 * - `loader` 模板加载器，默认自带，可选。
 *
 * layer 参数，为 swig-view 的中间层，用来扩展模板能力。
 * 比如通过 addScript, addStyle 添加的 js/css 会自动在页面开头结尾处才输出。
 *
 * 更多细节请查看 swig-view
 *
 * @return {Readable Stream}
 */
var SwigWrap = module.exports = function SwigWrap(options, layer) {

    //console.log('>>>options0' + JSON.stringify(options));

    if (!(this instanceof SwigWrap)) {
        return new SwigWrap(options, layer);
    }

    // 重写 loader, 让模板引擎，可以识别静态资源标示。如：static/lib/jquery.js
    options.loader = options.loader || loader(layer, options.views);

    var swig = this.swig = swigInstance = options.cache && swigInstance || new Swig(options);
    this.options = swig.options;

    //console.log('>>>options1' + JSON.stringify(options));
    //console.log('>>>options2' + JSON.stringify(this.options));

    tags.forEach(function (tag) {
        var t = require('./tags/' + tag);
        swig.setTag(tag, t.parse, t.compile, t.ends, t.blockLevel || false);
    });


    this.buzy = false;
};

util.inherits(SwigWrap, Readable);

SwigWrap.prototype._read = function(n) {
    if (!this.buzy && this.view) {
        this.renderFile(this.view, this.locals);
    }
};

SwigWrap.prototype.makeStream = function(view, locals) {
    Readable.call(this, null);
    this.view = view;
    this.locals = locals;
    return this;
};

// 不推荐直接调用
// 最后在初始化 SwigWrap 的时候指定 view 已经 locals.
// 此方法将会自动调用。
SwigWrap.prototype.renderFile = function(view, options) {
    var self = this;

    if (this.buzy) return;
    this.buzy = true;

    // support chunk
    this.swig.renderFile(view, options, function(error, output) {
        if (error) {
            return self.emit('error', error);
        }

        self.push(output);
        self.push(null);
    });
};

SwigWrap.prototype.destroy = function() {
    this.swig = null;
    this.removeAllListeners();
};

// 这个方法在 tags/widget.js 中调用。
Swig.prototype._w = Swig.prototype._widget = function(layer, id, attr, options) {
    var self = this;
    var pathname = layer.resolve(id);

    //console.log('----pathName:' +pathname + ' options:' + JSON.stringify(options));
    if (!layer.supportBigPipe() || !attr.mode || attr.mode === 'sync') {
        layer.load(id);
        return this.compileFile(pathname, options);
    }

    return function(locals) {
        var container = attr['container'] || attr['for'];

        layer.addPagelet({
            container: container,
            model: attr.model,
            id: attr.id,
            mode: attr.mode,
            locals: locals,
            view: pathname,
            viewId: id,

            compiled: function(locals) {
                var fn = self.compileFile(pathname, options);
                var layer = locals.fiswig;
                layer && layer.load(id);
                return fn.apply(this, arguments);
            }
        });

        return container ? '' : '<div id="' + attr.id + '"></div>';
    };
};