var db = require('./db');
var Sequelize = require('sequelize');
var common = require('../utils/common');

var User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  userName: {
    type: Sequelize.STRING(50),
    field: "user_name",
    defaultValue: ''

  },
  password: {
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
  tableName: 'user'
});

User.hook('beforeCreate', function(model, options, fn) {
  model.createdAt || (model.createdAt = common.getTime());
  fn(null, model);
});

module.exports = User;