var exports = module.exports;

/**
 * trigger the load of FIS, it means add a js/css file to the page.
 *
 * @alias require
 *
 * @example
 * // if `namespace` = `user`
 * // load mod.js
 * {%require "user:static/mod.js"%}
 *
 * @param {string|var} id  the resource `id` of the FIS system.
 */
exports.compile = function(compiler, args, content, parents, options, blockName) {

    var code = '_ctx.fiswig.load(' + args.pop() + ');';

    console.log('>>>>require compile:' + code);

    return code;
};

exports.parse = function(str, line, parser, types) {
    parser.on(types.STRING, function (token) {
        var self = this;
        self.out.push(token.match);
    });
    return true;
};

exports.ends = false;