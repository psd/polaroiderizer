/*
 * Polaroiderizer - slideshow from feeds using jQuery
 *
 * Copyright (c) 2008 Phil Hawksworth
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
;(function($) {

$.fn.polaroiderizer = function(options) {
	var defaults = {};
	var settings = $.extend(true, defaults, options);

	// handle the form submission.
	$('#form').submit(function(){
		var query = $('#query').val();

		// set the fragment identifier
		window.location.hash = '#' + query;

		// kick off display queue
		displayQueue.start();
		
		// kick off feed queue
		feedQueue.start({queue: displayQueue, query: query});

		return false;
	});

	// get the fragment identifier
	if(window.location.hash) {
		$('#query').val(window.location.hash.split('#')[1]);
		$('form').submit();
	}

	// fullscreen UI selector
	$('a.toggleFullscreen').click(function(){
		toggleFullscreen();
	});
	$().keypress(function(e){
		if(!$(e.target).is('#query')) {
			if(e.which == 102) {
				toggleFullscreen();
			}
		}
	});

	// transition UI selector
	$('#options a').click(function(){
		var target = $(this);
		if(!target.hasClass('selected')) {
			$('#options a').removeClass('selected');
			target.addClass('selected');
		}
		target.blur();
		return false;
	});
};


// toggle fullscreen with the f key or a click.	
function toggleFullscreen (argument) {
	var display = $('#display');
	$('#title, #form, #controls, #footer').toggle();
	$('body').toggleClass('kiosk');
	display.toggleClass('kiosk');
	if(display.hasClass('kiosk')) {
		var h = $(window).height() + 'px';
		display.height(h);		
	} else {
		display.height('500px');				
	}
}

})(jQuery);
