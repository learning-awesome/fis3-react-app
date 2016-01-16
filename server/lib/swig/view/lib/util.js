var _ = module.exports = {};
var caller = require('caller');
var path = require('path');

_.mixin = function mixin(a, b) {
    if (a && b) {
        for (var key in b) {
            a[key] = b[key];
        }
    }
    return a;
};

_.tpl = function tpl(str, locals) {
    var code = "var p=[];" +

        "p.push('" +

        // Convert the template into pure JavaScript
        str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") +

        "');return p.join('');";

    var fn = new Function(code);

    return locals ? fn.call(locals) : fn;
};

_.resolveEngine = (function() {
    // swig-view 项目目录。
    var root = path.dirname(path.dirname(caller()));

    //console.log('>>>>root:' + root);
    return function resolveEngine(name) {
        if (typeof name === 'function'){
            return name;
        }

        //console.log('>>view engine path:' + path.resolve(root, name));

        var fn = _.tryResolve(name) || _.tryResolve(path.resolve(root, name));

        if (!fn) {
            throw new Error('Cant find View Engine ' + name);
        }

        return require(fn);
    };
})();

_.tryResolve = function tryResolve(module) {
    try {
        return require.resolve(module);
    } catch (e) {
        return undefined;
    }
};