var configs = {
	local: {
		url: 'http://localhost:16888'
	},
	production: {
		url: 'http://bingo.giuocob.com'
	}
};

var env = process.env.NODE_ENV || 'local';
if(!configs[env]) {
	console.log('Invalid NODE_ENV value: ' + env);
	process.exit();
}

module.exports = configs[env];