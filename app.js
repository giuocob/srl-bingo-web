var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 16888;

app.set('port', port);
app.use(bodyParser.json());

var handlebarsLib = require('./lib/handlebars/handlebars');
handlebarsLib.setEngine(app);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	res.end('Hi!');
});

var baseUrl = config.url;  // This is us


var waterskulls = require('waterskulls');
var bingoHandlebars = require('./lib/handlebars/bingo');

// Display an old difficulty-synergy card.
// Accepts size (3-7) and seed as optional parameters.
app.get('/test/difficulty-synergy', function(req, res, next) {
	var params = {};
	var seed, size;
	if(req.query.size) params.size = parseInt(req.query.size, 10);
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	var card, displayCard;
	try {
		card = waterskulls.generateDifficultySynergyCard(params);
		displayCard = bingoHandlebars.getCardDisplayFormat(card);
	} catch(error) {
		return res.status(500).end(error.stack);
	}
	// Make pretty page
	res.render('simple-bingo', {
		pageTitle: 'OoT Bingo',
		card: displayCard
	});
});

// Display an old difficulty-synergy card.
// Accepts seed only.
app.get('/bigbingo', function(req, res, next) {
	var params = {
		size: 7
	};
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	var card, displayCard;
	try {
		card = waterskulls.generateDifficultySynergyCard(params);
		displayCard = bingoHandlebars.getCardDisplayFormat(card);
	} catch(error) {
		return res.status(500).end(error.stack);
	}
	var seed = card.seed;
	var permLink = baseUrl + '/bigbingo?seed=' + seed;
	// Make pretty page
	res.render('big-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
		card: displayCard
	});
});

app.listen(app.get('port'));
console.log('Server listening on port ' + port);
