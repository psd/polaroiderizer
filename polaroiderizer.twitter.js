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


    $.fn.polaroiderizer.feed.twitter = function (text) {
        var uri = 'http://search.twitter.com/search.json?q=' + escape(text) + '&callback=?';

        $.getJSON(uri, function (data) {
            $.each(data.results, function (i, item) {

                // TBD:- turn twitpics into photos :
                // http://yfrog.com/15vfizj ->  http://yfrog.com/15vfizj:iphone
                // http://twitgoo.com/3ergg -> http://twitgoo.com/3ergg/img
                // http://img.ly/4gx -> http://img.ly/show/thumb/4gx

                var text = item.text;
                text = text.replace(/(http:[\S]+)/g, "<a href='$1'>$1</a>");
                text = text.replace(/@([\w]+)/g, "@<span class='vcard'><a href='http:\/\/twitter.com/$1' class='fn' rel='contact'>$1<\/a></span>");
                text = text.replace(/#([^<\s][\S]+)/g, "#<a href='http:\/\/search.twitter.com\/q=$1' rel='tag'>$1<\/a>");
                text = text.replace(/L:(.*)/, "L:<a href='http:\/\/maps.google.com/maps?f=q&q=$1'>$1<\/a>");

                $.fn.polaroiderizer.addItem({
                    type: 'tweet', 
                    id: 'twitter_' + item.id,
                    href: 'http://twitter.com/' + item.from_user + '/statuses/' + item.id,
                    user: item.from_user,
                    profile: "http://twitter.com/" + escape(item.from_user),
                    img: item.profile_image_url, 
                    created: item.created_at,
                    text: text
                });
            });
        });
    };

}(jQuery));
