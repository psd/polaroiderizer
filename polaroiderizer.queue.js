/*
 * Polaroiderizer - slideshow from feeds using jQuery - display queue
 *
 * Copyright (c) 2008 Phil Hawksworth
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

// display queue
var displayQueue = {
	qPos: 0,
	items: [],
	timer: null,
	interval: 3000
};

displayQueue.clear = function() {
	this.qPos = 0;
	this.displayQueue = [];
	$('#staging').empty();
}

displayQueue.add = function(item) {
	this.items.push(item);
}

displayQueue.show = function(item) {
	// show item
	$(item).transition();

	// update status
	var title = $(item).find('img').attr('title');
	var link = $(item).clone().empty().text(title);					
	$('#status').html(link);
}

displayQueue.next = function() {
console.log("next!");
	if(this.items.length > 0) {
		var item = displayQueue.items[this.qPos];
		if(item) {
			this.show(item);
			this.qPos++;

			if(this.qPos >= this.items.length) {
				this.qPos = 0;
			}
		} 
	}
	var me = this;
	this.timer = setTimeout(function() { me.next(); }, this.interval);
};
