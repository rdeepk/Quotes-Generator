var tweet_text, category;
var themes = ["theme1","theme2","theme3","theme4"];

// Returns random element index of the given array
var randomIndex = function(size){
	var random  = Math.floor(Math.random() * size);
	return random == size ? random-- : random;
}

// Returns array of all quotes for the selected category in the dropdown
function getAllQuotesFromCategory(data) {
	category = document.getElementById("categories").value;
	function filterCategory(){
		return function(element){
			return element['category'] === category;
		}		
	}
	return data.filter(filterCategory(category));
}

// Returns random quote from the array of quotes passed as argument
function newQuote(arrayOfQuotes) {
	var chosenIndex = randomIndex(arrayOfQuotes.length);
	return arrayOfQuotes.filter((quotes, index) =>  index == chosenIndex)[0];
}

// Animates the item
(function ( $ ) {
	$.fn.itemAnimate = function(context, value) {
		$(this).animate({
		opacity: 0
	}, 800,
		function() {
			$(this).animate({
			opacity: 1
		}, 500);
		if(context == 'quote'){
			$(this).setText(value);
		} else {
			$(this).setTheme(value);
		}
	});
		return this;			
	};
}( jQuery ));

// sets html for element
(function ( $ ) {
	$.fn.setText = function(value) {
		$(this).html(value);
	}
}( jQuery ));

// sets theme for the element	
(function ( $ ) {
	$.fn.setTheme = function(value) {
		$(this).removeClass();
		$(this).addClass(value);
	}
}( jQuery ));

// updates with the fresh quote
function changeQuote(quote) {
	var quoteText = "<i class='fa fa-quote-left'></i> " + quote['quote'] ;
	var autherText = "- " +quote['by'];
	$( "#quote" ).itemAnimate('quote', quoteText);
	$("#quote_by").itemAnimate('quote', autherText);
}

// change the theme of the app
function changeTheme() {
	var currentTheme = themes[randomIndex(themes.length)];
	$("#themes").itemAnimate('theme', currentTheme);
}

// Displays fresh quote of the category
function fresh(){
	var randomQuote = newQuote(getAllQuotesFromCategory(JSON.parse(data)));
	tweet_url = "https://twitter.com/intent/tweet?text="+randomQuote['quote']+"&hashtags=quotes,"+category;
	changeQuote(randomQuote);
	changeTheme();		
}

fresh();

document.getElementById("next_quote").addEventListener("click", function(event) {
	fresh();
}, false);

$("#tweet").on( "click", function( event ){
	event.preventDefault();
	popupCenter(tweet_url, "twitterwindow", 550, 420);
});

function popupCenter(url, title, w, h) {
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top=200, left='+left);
}