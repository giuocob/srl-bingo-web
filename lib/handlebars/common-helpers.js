var Handlebars = require('handlebars');

var helpers = {
	joinWithSpaces: function(arr) {
		return arr.join(' ');
	}
};

Object.keys(helpers).forEach(function(helperName) {
	Handlebars.registerHelper(helperName, helpers[helperName]);
});