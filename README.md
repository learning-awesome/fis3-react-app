fis3-react-app
====================


基于fis3+express+swig + react 的前端和后端集成解决方案工程示例。在阅读此文档之前，希望你最好对fis、swig、express 、mysql有一定的了解。


## 目录

* [特点](#特点)
* [快速开始](#快速开始)
* [目录规范](#目录规范)
 - [public 目录](#page-目录)
        - [component 目录](#组件)
        - [static 目录](#css／js／image公共静态资源)
 - [views 目录](#static-目录)
      - [page 目录](#页面模板)
      - [widget 目录](#组件)
    - [server.conf](#serverconf)
 - [server 目录](#后端)
    - [controller 目录](#路由)
    - [lib 目录](#组件扩展)
    - [middleware 目录](#中间件)
    - [model 目录](＃数据模型)
    - [utils 目录](＃工具类)
 - [fis-conf.js](#fis配置文件)
 - [app.js](#express启动入口)

## 特点

* 基于原生fis前端集成方案对前端资源进行打包，相比自定义fis扩展，方便fis组件升级和维护。
* 整合前端和后端，提供一套骨架，并提供基于mysql的运行示例，拿来即可使用，扩展也很方便。
* 模板引擎采用 [swig](http://paularmstrong.github.io/swig/) ，提供易用的 `html`、`head`、`body`、`widget`、`script`、`style` 等扩展标签。基于这些标签后端可以自动完成对页面的性能优化。
* 基于 `widget` 标签，可以轻松实现组件化，同名tpl、 css、js自动关联加载。


## 示例截图

 ![image](https://raw.githubusercontent.com/hubcarl/fis-express-swig/master/client/public/static/images/demo.png)


## 快速开始

如果还没有安装 [node](http://nodejs.org) 请先安装 [node](http://nodejs.org).

```bash
# 安装 fis 到全局
npm install -g fis

# 下载工程.
git clone https://github.com/hubcarl/fis-express-swig.git


# 进入 fis-express-swig  目录， release 后就可以预览了。
cd fis-express-swig


#工程运行
fis release -w 文件修改监控
fis release -m  资源文件md5签名 
fis release --optimize --md5 --watch --pack # fis release -omwp
fis release -omwp   o 资源压缩  m 资源文件md5签名  w 文件修改监控   p打包合并
fis server start --timeout 10000  --port 9000   --type node
```

### page 目录

所有页面级别的模板文件，放在此目录。此tpl 可以直接在浏览器中预览。比如 page/index.tpl 可以通过 http://127.0.0.1:9000 访问。 需要强调的的是，模板引擎采用的是 [swig](http://paularmstrong.github.io/swig/), 可以采用模板继承机制来实现模板复用。

layout.tpl

```tpl
<!doctype html>
{% html lang="en" framework="public/static/js/mod.js"  %}
    {% head %}
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="/static/favicon.ico">
        <title>{{ title }}</title>

        {% require "public/static/css/normalize.css" %}
        {% require "public/static/css/bootstrap.css" %}
        {% require "public/static/css/app.css" %}


    {% endhead %}

    {% body %}

        {% widget "widget/menu/menu.tpl" %}


            {% block beforecontent %}
            {% endblock %}

            <div class="container">
                {% block content %}
                {% endblock %}
            </div>
    
        {% block aftercontent %}
        {% endblock %}
    
    {% endbody %}

{% endhtml %}

```

news/index/index.tpl

```tpl
{% extends 'page/layout.tpl' %}

{% block content %}

<div class="container smart-container">
    <div class="row row-offcanvas row-offcanvas-right">
        <div class="col-xs-12 col-sm-9">
            <ul class="smart-artiles" id="articleList">
                {% for item in list %}
                <li>
                    <div class="point">+{{item.hits}}</div>
                    <div class="card">
                        <h2><a href="/detail/{{item.id}}" target="_blank">{{item.title}}</a></h2>
                        <div>
                            <ul class="actions">
                                <li>
                                    <time class="timeago">{{item.createDate}}</time>
                                </li>
                                <li class="tauthor">
                                    <a href="#" target="_blank" class="get">Sky</a>
                                </li>
                                <li><a href="#" class="kblink-8007">+收藏</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                {% endfor %}
            </ul>
            <div id="pagerBottom" class="smart-pager"></div>
        </div>
    </div>
</div>

{% require "client/views/page/news/index/index.js" %}

{% script %}
    console.log('>>>>test>>>>>');
    require('client/views/page/news/index/index.js');
{% endscript %}


{% endblock %}

```

### static 目录

用来存放所有静态资源文件，css, js, images ,组件等等。如：

```
├── css
│   ├── bootstrap-theme.css
│   ├── bootstrap.css
│   └── style.css
└── js
    ├── bootstrap.js
    └── mod.js
```

### widget 目录

用来存放各类组件代码。组件分成3类。

1. 模板类：包含 tpl, 可以选择性的添加 js 和 css 文件，同名的 js 和 css 会被自动加载。

  模板类文件，可以在模板中通过 widget 标签引用。如

  ```tpl
  {% widget "widget/menu/menu.tpl" %}
  ```
2. js 类： 主要包含 js 文件，放在此目录下的文件一般都会自动被 amd define 包裹，可选择性的添加同名 css 文件，会自动被引用。

  此类组件，可以在 tpl 或者 js 中通过 require 标签引用。

  ```tpl
  
    {% require "client/views/page/news/index/index.js" %}

    {% script %}
        console.log('>>>>test>>>>>');
        require('client/views/page/news/index/index.js');
    {% endscript %}

  ```
3. 纯 css 类：只是包含 css 文件。比如 compass. 同样也是可以通过 require 标签引用。



### fis-conf.js 

编译配置文件，详情请查看[配置 API](http://fis.baidu.com/docs/api/fis-conf.html)。

