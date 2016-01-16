var proto = module.exports = {

    render: function(path, options, next) {
        options = options || {};
        options['response'] = this;

        if (!this.get('Content-Type')) {
            this.type('html');
        }
        
        var ret =  proto.__proto__.render.call(this, path, options, next);
        
        delete options.response;
        return ret;
    }

};