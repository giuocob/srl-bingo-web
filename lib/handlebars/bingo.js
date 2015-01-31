var Handlebars = require('handlebars');
var cardUtils = require('waterskulls').cardUtils;

var helpers = {
	// None right now
};

Object.keys(helpers).forEach(function(helperName) {
	Handlebars.registerHelper(helperName, helpers[helperName]);
});


// Turn a bingo card into the format needed by the bingo-board template
// Return value will be like:
// { seed: 12345, size: 5, board: [...] }
// Board is doubly nested array of squares, each of which has id, classes, and content
exports.getCardDisplayFormat = function(card) {
	var ret = {
		seed: card.seed
	};
	var size = ret.size = card.size;
	if(!card.goals || card.goals.length != size*size) throw new Error('Unexpected card format');
	var board = [];


	// Make lists of goals for each, row, in order
	var rowSquareMap = cardUtils.constructRowSquareMap(size);
	var squareRowMap = cardUtils.invertRowSquareMap(rowSquareMap);
	var renderRowSquares = {};

	var rowNum, colNum;

	for(rowNum = 0; rowNum < size; rowNum++) {
		var rowClass = 'row'+rowNum;
		renderRowSquares[rowClass] = [];
		var rowSquares = rowSquareMap['row'+rowNum];
		if(!rowSquares) throw new Error('Unexpected card format');
		rowSquares.forEach(function(squareNum) {
			var square = card.goals[squareNum];
			if(!square) throw new Error('Unexpected card format');
			var renderSquare = {
				id: 'square'+squareNum,
				classes: ['square'],
				content: square.name || ''
			};
			(squareRowMap[squareNum] || []).forEach(function(rowName) {
				renderSquare.classes.push(rowName);
			});
			renderRowSquares[rowClass].push(renderSquare);
		});
	}
	
	// Now start building the board
	// Top part: TLBR then all columns
	var currentBoardRow = [];
	currentBoardRow.push({
		id: 'tlbr',
		classes: ['header', 'tlbr'],
		content: 'TL-BR'
	});
	for(colNum = 0; colNum < size; colNum++) {
		currentBoardRow.push({
			id: 'col'+colNum,
			classes: ['header', 'col'+colNum],
			content: 'COL'+(colNum+1)
		});
	}
	board.push(currentBoardRow);
	// Now do the main rows
	for(rowNum = 0; rowNum < size; rowNum++) {
		var rowName = 'row'+rowNum;
		currentBoardRow = [];
		currentBoardRow.push({
			id: rowName,
			classes: ['header', 'row'+rowNum],
			content: 'ROW'+(rowNum+1)
		});
		renderRowSquares[rowName].forEach(function(renderSquare) {
			currentBoardRow.push(renderSquare);
		});
		board.push(currentBoardRow);
	}
	// Now lonely lonely bltr
	currentBoardRow = [{
		id: 'bltr',
		classes: ['header', 'bltr'],
		content: 'BL-TR'
	}];
	board.push(currentBoardRow);

	ret.board = board;
	return ret;
};
