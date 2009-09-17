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

var displayQueue = [];
var qPos = 0;
var timer = null;

// choose the transition effect
$.fn.transition = function() {
	var effect = $('#options a.selected').text();
	if(effect == 'polaroids'){
		this.polaroidScroll();
	} else if(effect == 'faders'){
		this.faders();	
	} else if(effect == 'plain'){
		this.plain();	
	}	
	return this;
};

// Iterate throught the images which are downloaded and ready to display.
function displayNext(){
	var i = displayQueue[qPos];
	if(i) {
		$(i).transition();
		var title = $(i).find('img').attr('title');
		var link = $(i).clone().empty().text(title);					
		$('#status').html(link);
	} 
	qPos++;
	if(qPos >= displayQueue.length) {
		qPos = 0;
	}
	timer = setTimeout(function() { displayNext(); }, 3000);				
};


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

$.fn.polaroiderizer = function(options) {

	// handle the form submission.
	$('form').submit(function(){
		var tag = $('#tag').val();
		$('#staging').empty();
		displayQueue = [];
		qPos = 0;
		getPhotos(tag);
		$('#status').html('checking flickr for photos tagged '+ tag + '...');
		window.location.hash = '#' + tag;
		return false;
	});
	
	// set the tag in the form if we find a tag in the uri.
	if(window.location.hash) {
		$('#tag').val(window.location.hash.split('#')[1]);
		$('form').submit();
	}

	// Animation option button handlers.
	$('#options a').click(function(){
		var target = $(this);
		if(!target.hasClass('selected')) {
			$('#options a').removeClass('selected');
			target.addClass('selected');
		}
		target.blur();
		return false;
	});
	
	// toggle fullscreen with the f key or a click.	
	$('a.toggleFullscreen').click(function(){
		toggleFullscreen();
	});
	$().keypress(function(e){
		if(!$(e.target).is('#tag')) {
			if(e.which == 102) {
				toggleFullscreen();
			}
		}
	});
};
