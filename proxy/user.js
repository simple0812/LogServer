var models = require('../models/');
var config = require('../config');
var logger = require('../utils/logger');
var Promise = require('bluebird');
var moment = require('moment');

exports.update = function(model) {
  return models.User.update(model, {
    where: {
      id: model.id
    }
  });
};

exports.create = function(model) {
  return models.User.create(model).then(function(doc) {
    return Promise.resolve(doc);
  });
};

exports.delete = function(ids) {
  return models.User.destroy({
    where: {
      id: ids
    }
  });
};

exports.retrieve = function(opts) {
  var criteria = opts || {};
  return models.User.all({
    where: criteria
  });
};

exports.getByName = function(name) {
  return models.User.find({
    where: {
      'user_name': name
    }
  }).then(function(doc) {
    return Promise.resolve(doc);
  });
};

