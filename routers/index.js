module.exports = function (app) {
	app.use(require('./foo'));
	app.use(require('./file'));
};
