//var NodeCache = require( "node-cache" );
//module.exports = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

//{'192_168_1_113':['xxxxxxx', 'xxxxxxxxxxx'], '192_168_1_114':['xxxxxxx', 'xxxxxxxxxxx'] }
var _ = require('underscore');
var cache = {};

function getAll() {
	return _.keys(cache);
}

function getByKey(key) {
	return cache[key] || [];
}

function set(key, val, isReplace) {

	if(_.isArray(val) || isReplace) {
		cache[key] = val;
		return;
	}

	if(cache[key]) {
		cache[key].push(val);
		if(cache[key].length >= 20) {
			cache[key].shift();
		}
	}

	cache[key] = [];
	cache[key].push(val);
}

module.exports = {
	getAll : getAll,
	getByKey:getByKey,
	set : set
};