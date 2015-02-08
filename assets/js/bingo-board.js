$(function() {
	$('.bingo-element').each(function() {
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

		// Popout opener
		bingoElem.find('.header').each(function() {
			var headerElem = $(this);
			var rowName = headerElem.attr('id');
			var rowNameText = headerElem.text();
			headerElem.click(function() {
				// Assemble sorted list of goals
				var unsortedGoalSet = [];
				bingoElem.find('.square.'+rowName).each(function() {
					var squareElem = $(this);
					unsortedGoalSet.push({
						id: squareElem.attr('id'),
						text: squareElem.text()
					});
				});
				var sortedGoalSet = unsortedGoalSet.sort(function(a, b) {
					var idRegex = /^square([0-9]+)$/;
					var aOrder = idRegex.exec(a.id)[1], bOrder = idRegex.exec(b.id)[1];
					if(aOrder) aOrder = parseInt(aOrder, 10);
					if(bOrder) bOrder= parseInt(bOrder, 10);
					return (aOrder - bOrder);
				});
				// Construct query string
				var queryParams = {
					rowName: rowNameText
				};
				for(var i=0; i<sortedGoalSet.length; i++) {
					var goalEntry = sortedGoalSet[i];
					queryParams['goal'+i] = goalEntry.text;
				}
				var queryString = $.param(queryParams);
				window.open(
		        	'/popout?' + queryString,
		        	'_blank',
		        	'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=220, height=460'
		        );
			});
		});
	});
});
