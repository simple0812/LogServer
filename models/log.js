var db = require('./db');
var Sequelize = require('sequelize');
var common = require('../utils/common');

var Log = db.define('log', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(50)

    },
    deviceId: {
        type: Sequelize.INTEGER
    },
    type: {
        type: Sequelize.INTEGER,
        defaultValue: 4
    },
    data1: {
        type: Sequelize.INTEGER
    },
    data2: {
        type: Sequelize.INTEGER
    },
    data3: {
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.STRING(50),
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },

}, {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    tableName: 'log'
});

module.exports = Log;