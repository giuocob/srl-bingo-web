var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 16888;

app.set('port', port);
app.use(bodyParser.json());

var handlebarsLib = require('./lib/handlebars/handlebars');
handlebarsLib.setEngine(app);



app.get('/', function(req, res, next) {
	res.end('Hi!');
});


var waterskulls = require('waterskulls');

// Display an old difficulty-synergy card.
// Accepts size (3-7) and seed as optional parameters.
app.get('/test/difficulty-synergy', function(req, res, next) {
	var params = {};
	var seed, size;
	if(req.query.size) params.size = parseInt(req.query.size, 10);
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	var card;
	try {
		card = waterskulls.generateDifficultySynergyCard(params);
	} catch(error) {
		return res.status(500).end(error.stack);
	}
	// Make pretty page
	res.render('test-bingo', {
		pageTitle: 'A bingo board!',
		card: card
	});
});

app.listen(app.get('port'));
console.log('Server listening on port ' + port);
