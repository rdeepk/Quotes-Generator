var tweetUrl, category;
var themes = ['theme1','theme2','theme3','theme4','theme5','theme6','theme7'];

/**
 * @summary Returns random element index of the given array.
 *
 * @param number $size Length of array.
 *
 * @return number Random element index.
 */
var randomIndex = function( size ) {
	var random  = Math.floor( Math.random() * size );
	return random == size ? random-- : random;
}

/**
 * @summary Returns array of all quotes for the selected category in 
 * the dropdown.
 *
 * @param array $data Array of quotes.
 *
 * @return array Filetered quotes of the chosen category in the select box.
 */
function getAllQuotesFromCategory( data ) {
	category = document.getElementById( 'categories' ).value;
	function filterCategory() {
		return function( element ) {
			return element['category'] === category;
		}		
	}
	return data.filter( filterCategory( category ) );
}

/**
 * @summary Provides random quote from the array of quotes.
 *
 * @param array $arrayOfQuotes Array of quotes.
 *
 * @return array Chosen random quote data.
 */
function newQuote( arrayOfQuotes ) {
	var chosenIndex = randomIndex( arrayOfQuotes.length );
	return arrayOfQuotes.filter( ( quotes, index ) =>  index == chosenIndex )[0];
}

/**
 * @summary Animates the item.
 */
( function ( $ ) {
	$.fn.itemAnimate = function( context, value ) {
		$( this ).animate ({
		opacity: 0
	}, 800,
		function() {
			$(this).animate ({
			opacity: 1
		}, 500);
		if( context == 'quote' ) {
			$( this ).setText( value );
		} else {
			$( this ).setTheme( value );
		}
	});
		return this;			
	};
}( jQuery ));

/**
 * @summary Sets HTML for the element.
 */
( function ( $ ) {
	$.fn.setText = function( value ) {
		$( this ).html( value );
	}
}( jQuery ));

/**
 * @summary Sets theme for the element.
 */	
( function ( $ ) {
	$.fn.setTheme = function( value ) {
		$( this ).removeClass();
		$( this ).addClass( value );
	}
}( jQuery ));

/**
 * @summary updates the page with the fresh quote data.
 *
 * @param array $quote Array of chosen quote data.
 */
function changeQuote( quote ) {
	var quoteText = "<i class='fa fa-quote-left'></i> " + quote['quote'] ;
	var autherText = '- ' +quote['by'];
	$( '#quote' ).itemAnimate( 'quote', quoteText );
	$( '#quote_by' ).itemAnimate( 'quote', autherText );
}

/**
 * @summary Updates the page with fresh theme.
 */
function changeTheme() {
	var currentTheme = themes[ randomIndex( themes.length ) ];
	$( '#themes' ).itemAnimate( 'theme', currentTheme );
}

/**
 * @summary Starts the process for fresh quote.
 *
 * @fires changeQuote() To change the quote on the app.
 * @fires changeTheme() To change the color theme on the app.
 * 
 * @global string $tweetUrl Sets tweet url for sharing on twitter.
 */
function fresh() {
	var randomQuote = newQuote( getAllQuotesFromCategory( JSON.parse( data ) ) );
	tweetUrl = 'https://twitter.com/intent/tweet?text='+randomQuote['quote']+'&hashtags=quotes,'+category;
	changeQuote( randomQuote );
	changeTheme();
	 $('#categories').find('option').css('color', '#949494');
    $('#categories').find('option:selected').css('color', '#dfdfdf');
}
fresh();
/**
 * @summary Adds click lestener to the button NextQuote.
 */
document.getElementById( 'next_quote' ).addEventListener( 'click', function( event ) {
	fresh();
}, false );

/**
 * @summary Opens twitter we intent pop up.
 */
$( '#tweet' ).on( 'click', function( event ) {
	event.preventDefault();
	popupCenter( tweetUrl, 'twitterwindow', 550, 420 );
});

/**
 * @summary Opens a pop up window.
 *
 * @param string $url Url for the new pop up.
 * @param string $title Title for the new pop up.
 * @param number $w Width for the new pop up.
 * @param number $h Height for the new pop up.
 *
 * @return Opens a new pop up window.
 */
function popupCenter( url, title, w, h ) {
	var left = ( screen.width/2 )-( w/2 );
	var top = ( screen.height/2 )-( h/2 );
	return window.open( url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top=200, left='+left );
}