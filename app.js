var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var XError = require('xerror');
var querystring = require('query-string');

console.log('\n\nStarting in env: ' + config.ENV);

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
var BingoApiClient = require('./lib/bingo-api-client');


// Get a standard oot card from the bingo api and display it.
app.get('/bingo/oot/standard', function(req, res, next) {
	var params = {};
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	if(req.query.version !== undefined) params.version = req.query.version
	if(req.query.mode !== undefined) params.mode = req.query.mode;

	var client = new BingoApiClient();
	client.request('bingo/oot/standard/get-card', {
		qs: params
	}, function(error, card) {
		if(error) return res.sendError(error);
		var displayCard;
		try {
			displayCard = bingoHandlebars.getCardDisplayFormat(card, {
				omit: [ 'size' ]
			});
		} catch(error) {
			return res.sendError(error);
		}
		var seed = card.seed;
		var qs = {
			seed: seed,
			version: card.version,
			mode: card.mode
		};
		var permLink = baseUrl + req.path + '?' + querystring.stringify(qs);
		// Make pretty page
		res.render('plain-bingo', {
			pageTitle: 'OoT Bingo',
			permLink: permLink,
			card: displayCard
		});
	});
});

// Troll route! :D
var trollGoals = [
	'Both Heart Pieces in Lost Woods',
	'Saria\'s Song',
	'Goron Bracelet',
	'Green Gauntlets',
	'At Least 9 Magic Beans'
];
app.get('/bingo/oot/standerd', function(req, res, next) {
	var card = {
		size: 5,
		goals: []
	};
	for(var i = 0; i < 25; i++) {
		var index = Math.floor(Math.random() * trollGoals.length);
		card.goals.push({
			name: trollGoals[index]
		});
	}
	try {
		displayCard = bingoHandlebars.getCardDisplayFormat(card, {
			omit: [ 'size' ]
		});
	} catch(error) {
		return res.sendError(error);
	}
	var permLink = baseUrl + req.path;
	res.render('plain-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
		card: displayCard
	});
});


// Display an old difficulty-synergy card.
// Accepts size (3-7) and seed as optional parameters.
app.get('/waterskulls/test', function(req, res, next) {
	var params = {};
	if(req.query.seed !== undefined) params.seed = req.query.seed;
	if(req.query.size) {
		var size = parseInt(req.query.size, 10);
		if(!isNaN(size)) params.size = size;
	}
	var card, displayCard;
	try {
		card = waterskulls.generateDifficultySynergyCard(params);
		displayCard = bingoHandlebars.getCardDisplayFormat(card);
	} catch(error) {
		return res.sendError(error);
	}
	var seed = card.seed;
	var permLink = baseUrl + req.path + '?seed=' + seed + '&size=' + card.size;
	// Make pretty page
	res.render('plain-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
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
		displayCard = bingoHandlebars.getCardDisplayFormat(card, {
			omit: [ 'version', 'mode', 'size' ]
		});
	} catch(error) {
		return res.sendError(error);
	}
	var seed = card.seed;
	var qs = {
		seed: seed
	};
	var permLink = baseUrl + req.path + '?' + querystring.stringify(qs);
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
		displayCard = bingoHandlebars.getCardDisplayFormat(card, {
			omit: [ 'version', 'mode', 'size' ]
		});
	} catch(error) {
		return res.sendError(error);
	}
	var seed = card.seed;
	var qs = {
		seed: seed
	};
	var permLink = baseUrl + req.path + '?' + querystring.stringify(qs);
	// Make pretty page
	res.render('plain-bingo', {
		pageTitle: 'OoT Bingo',
		permLink: permLink,
		card: displayCard
	});
});

// Bingo poput handler, should be identical across card types
app.get('/bingo-popout', function(req, res, next) {
	var rowName = req.query.rowName;
	if(!rowName) return res.sendError(new XError(
		XError.BAD_REQUEST,
		'rowName is a required parameter'
	));
	var goals = [];
	var goalCounter = 0;
	while(true) {
		var currentGoal = req.query['goal'+goalCounter];
		if(!currentGoal) break;
		if(goalCounter >= 10) {
			return res.sendError(new Error(XError.BAD_REQUEST, 'Too many goals provided'));
		}
		goals.push(currentGoal);
		goalCounter++;
	}
	if(goals.length === 0) return res.sendError(new Error(
		XError.BAD_REQUEST,
		'No goals provided'
	));
	var displayParams = bingoHandlebars.getPopoutDisplayFormat(rowName, goals);
	res.render('bingo-popout', {
		layout: 'fill-all',
		pageTitle: 'Bingo Popout',
		row: displayParams
	});
});

app.listen(app.get('port'));
console.log('Server listening on port ' + port);
