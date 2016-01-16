var exports = module.exports;

exports.compile = function(compiler, args, content, parents, options, blockName) {
    return '_output += _ctx.fiswig.getUrl(' + args.shift() + ');';
};

exports.parse = function(str, line, parser, types) {
    return true;
};

exports.ends = false;