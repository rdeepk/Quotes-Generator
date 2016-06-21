var tweetUrl, category, selectedOption;
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

//Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
    return (el.offsetParent === null)
}

/**
 * @summary Sets value of the select dropdown element.
 *
 * @param string $elementId id of the element.
 * @param string $value value to be set for the element.
 *
 */
 function setSelectedOption( elementId, value ) {
	var e = document.getElementById( elementId );
		var opts = e.options;
		for( var opt, j = 0; opt = opts[j]; j++ ) {
			if( opt.value ==  value ) {
			e.selectedIndex = j;
			break;
		}
	}
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
	//We have different select for xs screen, lets check which one is active
	if( isHidden ( document.getElementById( 'categories' ) ) ) {
		 category = document.getElementById( 'categories_xs' ).value;
		 //set same value to the other select dropdown
		 setSelectedOption( 'categories', category );
	} else {
		category = document.getElementById( 'categories' ).value;
		var e = document.getElementById( 'categories_xs' );
		//set same value to the other select dropdown
		setSelectedOption( 'categories_xs', category );
	}
	
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
	tweetUrl = urlEncode('https://twitter.com/intent/tweet?text='+randomQuote['quote'])+'&hashtags=quotes,'+category;
	changeQuote( randomQuote );
	changeTheme();
	//different color for selected select option
	$( '#categories' ).find( 'option' ).css( 'color', '#949494' );
    $( '#categories' ).find( 'option:selected' ).css( 'color', '#dfdfdf' );
	//different color for selected select option on xs screen
	$( '#categories_xs' ).find( 'option' ).css( 'color', '#949494' );
    $( '#categories_xs' ).find( 'option:selected' ).css( 'color', '#dfdfdf' );
}
fresh();

/**
 * @summary Adds click lestener to the button NextQuote on screens other than xs.
 */
document.getElementById( 'next_quote' ).addEventListener( 'click', function( event ) {
	fresh();
}, false );

/**
 * @summary Adds click lestener to the button NextQuote for xs screen.
 */
document.getElementById( 'next_quote_xs' ).addEventListener( 'click', function( event ) {
	fresh();
}, false );

/**
 * @summary Opens twitter intent pop up on screens other than xs.
 */
$( '#tweet' ).on( 'click', function( event ) {
	event.preventDefault();
	popupCenter( tweetUrl, 'twitterwindow', 550, 420 );
});

/**
 * @summary Opens twitter intent pop up on xs screen.
 */
$( '#tweet_xs' ).on( 'click', function( event ) {
	event.preventDefault();
	popupCenter( tweetUrl, 'twitterwindow', 550, 420 );
});

/**
 * @summary Encode the url with hexadecimal.
 *
 * @param string $url url to be encoded.
 *
 * @return string Encoded url.
 */
function urlEncode( url ) {
	url = url.replace(/&quot;/g, "\"");
	return encodeURI(url.replace(/&#039;/g, "\'"));
}

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