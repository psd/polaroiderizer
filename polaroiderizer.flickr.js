/*
 * Polaroiderizer - slideshow from feeds using jQuery
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * depends upon jQuery and the Async plugin:
 *   http://plugins.jquery.com/project/async
 *
 */

/*jslint browser: true, onevar: false */
/*global window, escape, jQuery */

(function ($) {

    var flickrPhoto = {};
    
    $.fn.polaroiderizer.feed.flickr = function (text) {
        var nphotos = 5; // max 50 in one page ..
        var api_key = '0a346a54dbca829015b11fcac9e70c6f';

        var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
            '&api_key=' + api_key +
            '&text=' + escape(text) +
            '&per_page=' + nphotos +
            '&format=json' +
            '&jsoncallback=?';

        $.getJSON(uri, function (data) {
            $.each(data.photos.photo, function (i, item) {

                if (flickrPhoto[item.id]) {
                    $.fn.polaroiderizer.addItem(flickrPhoto[item.id]);
                    return;
                } 
                var newitem = {
                    type: 'photo', 
                    id: 'flickr_' + item.id,
                    title: item.title, 
                    user: item.owner,
                    profile: "http://flickr.com/people/" + escape(item.owner),
                    text: item.description,
                    img: 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
                    href: 'http://flickr.com/photos/' + item.owner + '/' + item.id
                };
                var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.getInfo' +
                    '&api_key=' + api_key +
                    '&photo_id=' + escape(item.id) +
                    '&format=json' +
                    '&jsoncallback=?';
                $.getJSON(uri, function (item) {
                    newitem.user = item.photo.owner.username;
                    newitem.created = item.photo.dates.taken;
                    flickrPhoto[item.id] = newitem;
                    $.fn.polaroiderizer.addItem(newitem);
                });
            });
        });
    };

}(jQuery));
