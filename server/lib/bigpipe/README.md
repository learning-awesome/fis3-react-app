fiswig-bigpipe 
===========

[![Build Status](https://travis-ci.org/fex-team/fiswig-bigpipe.svg?branch=master)](https://travis-ci.org/fex-team/fiswig-bigpipe)
[![Coverage Status](https://coveralls.io/repos/fex-team/fiswig-bigpipe/badge.png)](https://coveralls.io/r/fex-team/fiswig-bigpipe)

An express.js middleware for fis widget pipline output.

This middleware is bundled in [fiswig](https://github.com/fex-team/fiswig).

With [fiswig](https://github.com/fex-team/fiswig) you can simple use the pagelet like
this.

```tpl
{% extends './layout.tpl' %}

{% block content %}
    {% widget "./pagelets/jumbotron/jumbotron.tpl" id="jumbotron" mode="async" %}
{% endblock %}

```

And in your controller, you can assign async data like this.

```javascript

router.get('/', function(req, res) {

    // pagelet Id
    res.bind('jumbotron', fuction(setter) {

        // simulate an async progress
        setTimeout(function() {
            
            // now set data to the pagelet
            setter(null, {
                asyncData: 'xxx'
            });
        }, 2000);
    });

    res.render('page/index.tpl');
});

```

Then the jumbotron content will be rendered in chunk mode.