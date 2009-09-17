/*
 * Polaroiderizer - slideshow from feeds using jQuery - flickr photos
 *
 * Copyright (c) 2008 Phil Hawksworth
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

// Get photos from the flickr API and add them to the display queue.
function getPhotos(tag, queue) {
	var status = $('#status');
	var staging = $('#staging');

	status.html('checking flickr for photos tagged '+ tag + '...');
	var nphotos = 10;
	var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
		'&api_key=0a346a54dbca829015b11fcac9e70c6f' +
		'&tags=' + tag +
		'&per_page=' + nphotos +
		'&format=json' +
	    '&jsoncallback=?';
	$.getJSON(uri, function(data){
		$.each(data.photos.photo, function(i,pic){
			status.html('Hoorah! I founds some. Let\'s grab them and make a little slideshow...');
			$('<img src="http://farm'+ pic.farm +'.static.flickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg" title="'+ pic.title +'">').
				load(function(){
					var a = $('<a href="http://flickr.com/photos/'+pic.owner+'/'+ pic.id +'" target="_BLANK"></a>').append($(this).clone());					
					queue.add(a);
				}).
				appendTo(staging);
		});
	});
}
