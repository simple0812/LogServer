var Log = require('./log');

var db = require('./db');


db.sync().then(function() {
    console.log('数据库同步成功')
}).catch(function(err) {
    console.log(err, '数据库同步失败')
})

exports.Log = Log;