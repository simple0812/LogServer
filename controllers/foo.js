// var proxy = require('../proxy/');
var BufferHelper = require('bufferhelper');
var config = require('../config');
var fs = require('fs');
var path = require('path');
var request = require('request');
var models = require('../models');

exports.retrieve = function(req, res, next) {
	models.User.findAll({attributes: ['userName', 'password', 'createdAt']}).then(docs => {
		res.json(docs);
	}) 
	
};

exports.post = function(req, res, next) {
	res.jsonp({data:'yy'});
};
