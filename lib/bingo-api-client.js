var config = require('../config');
var XError = require('xerror');
var request = require('request');

var BingoApiClient = function() {
	this.apiConfig = config.bingoApi;
}

BingoApiClient.prototype.request = function(apiPath, opts, cb) {
	if(apiPath.indexOf('/') !== 0) apiPath = '/' + apiPath;
	if(apiPath.indexOf('/api') !== 0) apiPath = '/api' + apiPath;
	var requestUrl = this.apiConfig.url + apiPath;
	if(!opts.json) opts.json = true;
	request(requestUrl, opts || {}, function(error, result, body) {
		if(error) return cb(new XError(XError.INTERNAL_ERROR, error.message, error));
		if(result.statusCode !== 200) {
			return cb(new XError(XError.INTERNAL_ERROR, 'Request to bingo API failed', error));
		}
		cb(null, body);
	});
};

module.exports = BingoApiClient;
