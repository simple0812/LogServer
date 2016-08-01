var models = require('../models/');
var config = require('../config');
var logger = require('../utils/logger');
var Promise = require('bluebird');
var moment = require('moment');
var db = require('../models/db');

exports.update = function(model) {
    return models.Article.update(model, {
        where: {
            id: model.id
        }
    });
};

exports.create = function(model) {
    return models.Article.create(model).then(function(doc) {
        return Promise.resolve(doc);
    });
};

exports.delete = function(ids) {
    return models.Article.destroy({
        where: {
            id: ids
        }
    });
};

exports.retrieve = function(opts) {
    var criteria = opts || {};
    return models.Article.all({
        where: criteria
    });
};


exports.getById = function(id) {
    return models.Article.all({
        where: {
            id: id
        }
    });
};
