/*
 * Polaroiderizer - slideshow from feeds using jQuery - feed handling
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

// attempting to make this and the display queue the same shape ..
var feedQueue = {
	qPos: 0,
	items: [],
	timer: null,
	interval: 6000,
	options: {}
};

feedQueue.start = function(options) {
	this.options = options;
	return this.next();
}

feedQueue.process = function(func) {
	return func(this.options.query, this.options.queue);
};

feedQueue.next = function() {
	console.log("here", this.items);
	if(this.items.length > 0) {
		var item = this.items[this.qPos];
		if(item) {
			this.process(item);
			this.qPos++;

			if(this.qPos >= this.items.length) {
				this.qPos = 0;
			}
		} 
	}
	var me = this;
	this.timer = setTimeout(function() { me.next(); }, this.interval);
}


// Get photos from the flickr API and add them to the display queue.
feedQueue.items.push(function(text, queue) {
	var status = $('#status');
	var staging = $('#staging');

	status.html('checking flickr for photo s'+ text + '...');
	var nphotos = 5;

	var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
		'&api_key=0a346a54dbca829015b11fcac9e70c6f' +
		'&text=' + escape(text) +
		'&per_page=' + nphotos +
		'&format=json' +
	    '&jsoncallback=?';

	console.log(uri);

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
});


// Get tweets from the flickr API and add them to the display queue.
feedQueue.items.push(function(text, queue) {
	var status = $('#status');
	var staging = $('#staging');

	status.html('checking twitter for tweets ...');

	var uri = 'http://search.twitter.com/search.json?q=' + escape(text) + '&callback=?';

	console.log(uri);

	$.getJSON(uri, function(data){
		$.each(data.results, function(i,item){
			status.html('found some tweets ..');
			$('<img src="'+item.profile_image_url+'" title="'+ item.from_user+'">').
				load(function(){
					var a = $('<a href="http://twitter.com/" target="_BLANK"></a>').
						append($(this).clone()).
						append('<span class="tweet text">'+item.text+'</span>');
					queue.add(a);
				}).
				appendTo(staging);
		});
	});
});
