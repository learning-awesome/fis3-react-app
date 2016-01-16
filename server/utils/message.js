/* 
* message.js 
* 说明：
* Created by Sky on  2015/10/2
* Copyright (c) 2015 Sky All Rights Reserved
*/
var propertiesReader = require('properties-reader');
var message = propertiesReader('config/message.conf');

exports.instance = function () {
 return message.path();
}

exports.get = function (key) {
 return message.get(key);
}

exports.set = function (key, value) {
 return message.set(key, value);
}