var models = require('./models');
var db = require('./models/db');
var Promise = require('bluebird');


db.sync().then(function() {
    console.log('数据库同步成功')
    var p = [];
    for(var i = 0; i< 100000; i++) {
		p.push(models.User.create({
			userName: 'John' + i,
		}))
	}

	Promise.all(p).then(docs => {
		console.log('........')
	})
}).catch(function(err) {
    console.log(err, '数据库同步失败')
})
