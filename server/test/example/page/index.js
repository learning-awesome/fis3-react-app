module.exports = function(req, res, next) {
    var origin = res.locals || {};

    next({
        title: 'Overided ' + origin.title,

        onPagelet: function(id, cb) {

            setTimeout(function() {
                cb(null, {
                    title: id,
                    content: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.'
                });
            }, Math.round(2000 * Math.random()));
        }
    });

}