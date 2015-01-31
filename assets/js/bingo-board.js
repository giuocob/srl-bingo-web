$(function() {
	$('.bingo').each(function() {
		var bingoElem = $(this);
		// Make it so that when you hover over a row header, it highlights all of its goals
		bingoElem.find('.header').each(function() {
			var headerElem = $(this);
			var rowName = headerElem.attr('id');
			headerElem.hover(function() {
				bingoElem.find('.square.'+rowName).addClass('hover');
			}, function() {
				bingoElem.find('.square.'+rowName).removeClass('hover');
			});
		});

		// Green/red/black square toggling
		/*bingoElem.find('.square').toggle(
			function () {
			  $(this).addClass('greensquare');
			},
			function () {
			  $(this).addClass('redsquare').removeClass('greensquare');
			},
			function () {
			  $(this).removeClass('redsquare');
			}
		);*/
		bingoElem.find('.square').each(function() {
			var squareElem = $(this);
			squareElem.click(function() {
				var highlightState = squareElem.data('highlightState');
				if(!highlightState) highlightState = 'black';
				var newState = 'black';
				if(highlightState == 'black') {
					newState = 'green';
					squareElem.addClass('greensquare');
				} else if(highlightState == 'green') {
					newState = 'red';
					squareElem.addClass('redsquare').removeClass('greensquare');
				} else if(highlightState == 'red') {
					newState = 'black';
					squareElem.removeClass('redsquare');
				}
				squareElem.data('highlightState', newState);
			});
		});
	});
});