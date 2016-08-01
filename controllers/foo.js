// var proxy = require('../proxy/');
var BufferHelper = require('bufferhelper');
var config = require('../config');
var fs = require('fs');
var path = require('path');
var request = require('request');

exports.retrieve = function(req, res, next) {
	res.jsonp({data:'xx'});
};

exports.post = function(req, res, next) {
	res.jsonp({data:'yy'});
};
