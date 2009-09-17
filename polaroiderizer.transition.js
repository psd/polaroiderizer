/*
 * Polaroiderizer - slideshow from feeds using jQuery - transitions
 *
 * Copyright (c) 2008 Phil Hawksworth
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

$.fn.polaroidScroll = function() {
	
	$('#display div.plain').remove();
				
	var frame = $('<div class="polaroid"></div>').append(this);
	var photo = $(this).find('img');

	$('#display').append(frame);
		
	// resize the photo to fit the viewport
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
		
	// set starting point
	var x = 40 + Math.floor(Math.random() * ($('#display').width() - frame.width() - 80));
	var y = frame.height();
	frame.css({top: '-'+y+'px', left: x+'px'});

	// set opacity of photo
	photo.css({opacity: '0'});

	// animate photo opacity and into view.
	frame.animate({top:'15px'}, 400);
	photo.animate({opacity: '1'}, 2000, function(picture){
		// animate slowly out of view and opacity of entire object.
		frame.animate({top:$('#display').height()+'px', opacity:'0'}, 5000, function(){
			frame.remove();
		});	
	});
	return this;				
};

// fading animation effect
$.fn.faders = function() {
	
	$('#display div.plain').remove();
		
	var frame = $('<div class="fader"></div>').append(this);
	var photo = $(this).find('img');

	$('#display').append(frame);
	
	// resize the photo to fit the viewport
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
	
	var x = ($('#display').width() - frame.width()) /2;
	var y = ($('#display').height() - frame.height()) /2;
	frame.css({top: y+'px', left: x+'px', opacity: '0'});
	frame.animate({opacity: '1'}, 2000, function(pic){
		frame.animate({opacity:'0'}, 3000, function(){
			frame.remove();
		});				
	});
	return this;				
};

// simplest.effect
$.fn.plain = function() {

	$('#display div.plain').remove();
	var frame = $('<div class="plain"></div>').append(this);
	$('#display').append(frame);
	
	// resize the photo to fit the viewport
	var photo = $(this).find('img');
	if(photo.height() > 400) {
		photo.css({height:photo.height()*0.75, width:photo.width()*0.75});
	}
	
	var x = ($('#display').width() - frame.width()) /2;
	var y = ($('#display').height() - frame.height()) /2;
	frame.css({top: y+'px', left: x+'px'});
	return this;				
};
