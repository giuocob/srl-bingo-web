var exphbs  = require('express-handlebars');
var Handlebars = require('handlebars');
var helpers = require('./helpers');

exports.Handlebars = Handlebars;

var handlebars = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: helpers,
    layoutsDir: __dirname+'/../../views/layouts',
    partialsDir: __dirname+'/../../views/partials'
});
exports.instance = handlebars;

exports.setEngine = function(app) {
	app.set('views', __dirname+'/../../views');
	app.engine('.hbs', handlebars.engine);
	app.set('view engine', '.hbs');
	return app;
};
