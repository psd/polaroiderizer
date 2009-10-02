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

    $.fn.polaroiderizer.feed.flickr = function (text) {
        statusMessage('f ..');
        var nphotos = 5;
        var api_key = '0a346a54dbca829015b11fcac9e70c6f';

        var uri = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
            '&api_key=' + api_key +
            '&text=' + escape(text) +
            '&per_page=' + nphotos +
            '&format=json' +
            '&jsoncallback=?';

        $.getJSON(uri, function (data) {
            $.each(data.photos.photo, function (i, item) {
                $.fn.polaroiderizer.addItem({
                    type: 'photo', 
                    id: 'flickr_' + item.id,
                    user: item.owner,
                    title: item.title, 
                    profile: "http://twitter.com/" + escape(item.from_user),
                    text: item.description,
                    img: 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
                    href: 'http://flickr.com/photos/' + item.owner + '/' + item.id
                });
            });
        });
    };

}(jQuery));
