import React, { Component } from 'react'
import { render } from 'react-dom'

var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

// 创建React组件
var CommentBox = React.createClass({
    // 在组件的生命周期中仅执行一次，用于设置初始状态
    getInitialState: function() {
        return {data: []};
    },
    onCommentSubmit: function(comment) {

        data.push(comment);

        var self = this;
        setTimeout(function() {
            // 动态更新state
            self.setState({data: data});
        }, 500);
    },
    // 当组件render完成后自动被调用
    componentDidMount: function() {
        var self = this;
        setTimeout(function() {
            // 动态更新state
            self.setState({data: data});
        }, 2000);
    },
    render: function() {
        return (
            // 并非是真正的DOM元素，是React的div组件，默认具有XSS保护
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.onCommentSubmit} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var Comment = React.createClass({
    render: function() {

        // 通过this.props.children访问元素的子元素
        var rawHtml = this.props.children.toString();
        return (
            // 通过this.props访问元素的属性
            // 不转义，直接插入纯HTML
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={{__html: rawHtml}} />
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {

        e.preventDefault();
        // e.returnValue = false;
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();

        if(!text || !author) return;

        this.props.onCommentSubmit({author: author, text: text});

        // 获取原生DOM元素
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
    },
    render: function() {
        return (
            // 为元素添加submit事件处理程序
            // 用ref为子组件命名，并可以在this.refs中引用
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Say something..." ref="text"/>
                <input type="submit" value="Post"/>
            </form>
        );
    }
});

// render方法创建组件的根元素，并注入到DOM元素中（第二个参数）
React.render(
    <CommentBox />,
    document.getElementById('content')
);