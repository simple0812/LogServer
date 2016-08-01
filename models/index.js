var Article = require('./article');
var User = require('./user');

var db = require('./db');

User.hasMany(Article, {foreignKey : 'uid'});
Article.belongsTo(User, {foreignKey : 'uid'});

db.sync().then(function() {
    console.log('数据库同步成功')
}).catch(function(err) {
    console.log(err, '数据库同步失败')
})

exports.Article = Article;
exports.User = User;