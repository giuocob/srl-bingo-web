var fs = require('fs');
var extend = require('extend');

var env = process.env.NODE_ENV || 'local';

var config = {
	local: {
		url: 'http://localhost:16888',
		bingoApi: {
			url: 'http://localhost:17888'
		}
	},
	prod: {
		url: 'http://www.srlbingo.com',
		bingoApi: {
			url: 'http://api.srlbingo.com'
		}
	}
};

var directory = fs.readdirSync(__dirname);
if(directory.indexOf('config-private.js') != -1) {
	var privateConfig = require('./config-private');
	config = extend(true, config, privateConfig);
}

if(!env) {
	console.log('No environment specified, exiting');
	process.exit(1);
}
if(!config[env]) {
	console.log('Invalid environment specified, exiting');
	process.exit(1);
}

var envConfig = config[env];
while(envConfig.inherits) {
	var inheritEnv = envConfig.inherits;
	delete envConfig.inherits;
	if(!config[inheritEnv]) {
		console.log('Config inherits from nonexistent env');
		process.exit(1);
	}
	var baseConfig = config[inheritEnv];
	envConfig = extend(true, baseConfig, envConfig);
}

envConfig.ENV = env;
module.exports = envConfig;
