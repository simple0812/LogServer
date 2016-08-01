var db = require('./db');
var Sequelize = require('sequelize');
var common = require('../utils/common');

var Article = db.define('article', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uid: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: {
    type: Sequelize.STRING(100),
    defaultValue: ''
  },
  content: {
    type: Sequelize.STRING(2000),
    defaultValue: ''
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  createdAt: {
    type: Sequelize.INTEGER,
    field: 'created_at'
  }

}, {
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  tableName: 'article'
});

Article.hook('beforeCreate', function(model, options, fn) {
  model.createdAt || (model.createdAt = common.getTime());
  fn(null, model);
});

module.exports = Article;