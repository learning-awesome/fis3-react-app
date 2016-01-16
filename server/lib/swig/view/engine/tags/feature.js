var exports = module.exports;


exports.compile = function(compiler, args, content, parents, options, blockName) {
	return 'if (_ctx._doorKeeper.getFlag(' + args.pop() + ')) { \n' +
    	compiler(content, parents, options, blockName) + '\n' +
    '}';
};

exports.parse = function(str, line, parser, types) {
    return true;
};

exports.ends = true;