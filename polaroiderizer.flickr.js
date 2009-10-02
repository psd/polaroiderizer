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

    flickrUser = {};
    
    $.fn.polaroiderizer.feed.flickr = function (text) {
        var nphotos = 50;
        var api_key = '0a346a54dbca829015b11fcac9e70c6f';

        var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
            '&api_key=' + api_key +
            '&text=' + escape(text) +
            '&per_page=' + nphotos +
            '&format=json' +
            '&jsoncallback=?';

        $.getJSON(uri, function (data) {
            $.each(data.photos.photo, function (i, item) {

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
                if (flickrUser[item.owner]) {
                    newitem.user = flickrUser[item.owner];
                    $.fn.polaroiderizer.addItem(newitem);
                } else {
                    var uri = 'http://api.flickr.com/services/rest/?method=flickr.people.getInfo' +
                        '&api_key=' + api_key +
                        '&user_id=' + escape(item.owner) +
                        '&per_page=' + nphotos +
                        '&format=json' +
                        '&jsoncallback=?';
                    $.getJSON(uri, function (item) {
                        newitem.user = item.person.username._content;
                        flickrUser[item.person.nsid] = newitem.user;
                        $.fn.polaroiderizer.addItem(newitem);
                    });
                }
            });
        });
    };

}(jQuery));
