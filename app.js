var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 16888;

app.set('port', port);
app.use(bodyParser.json());

var handlebarsLib = require('./lib/handlebars/handlebars');
handlebarsLib.setEngine(app);

// The easist dumbest error handler
app.use(function(req, res, next) {
	res.sendError = function(error) {
		this.status(500).end(error.stack);
	};
	next();
});


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
		return res.sendError(error);
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
		return res.sendError(error);
	}
	var seed = card.seed;
	var permLink = baseUrl + '/bigbingo?seed=' + seed;
	// Make pretty page
	res.render('plain-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
		card: displayCard
	});
});

// Kappa card
// Accepts seed only.
app.get('/kappa', function(req, res, next) {
	var params = {
		size: 1
	};
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	var card, displayCard;
	try {
		card = waterskulls.generateDifficultySynergyCard(params);
		displayCard = bingoHandlebars.getCardDisplayFormat(card);
	} catch(error) {
		return res.sendError(error);
	}
	var seed = card.seed;
	var permLink = baseUrl + '/kappa?seed=' + seed;
	// Make pretty page
	res.render('plain-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
		card: displayCard
	});
});

// Bingo poput handler, should be identical across card types
app.get('/popout', function(req, res, next) {
	var rowName = req.query.rowName;
	if(!rowName) return res.sendError(new Error('rowName is a required parameter'));
	var goals = [];
	var goalCounter = 0;
	while(true) {
		var currentGoal = req.query['goal'+goalCounter];
		if(!currentGoal) break;
		if(goalCounter >= 10) return res.sendError(new Error('Too many goals provided'));
		goals.push(currentGoal);
		goalCounter++;
	}
	if(goals.length === 0) return res.sendError(new Error('No goals provided'));
	var displayParams = bingoHandlebars.getPopoutDisplayFormat(rowName, goals);
	res.render('bingo-popout', {
		layout: 'fill-all',
		pageTitle: 'Bingo Popout',
		row: displayParams
	});
});

app.listen(app.get('port'));
console.log('Server listening on port ' + port);
