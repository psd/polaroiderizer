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

    $.fn.polaroiderizer.feed.moderated = function (text) {
        // hard-coded feed of photos to block/unblock
        // -- see moderated.php
        var uri = 'http://bytenight.osmosoft.com/moderated/?callback=?';
        $.getJSON(uri, function (data) {
            $.each(data.results, function (i, item) {
                if (item.blocked) {
                    $('#' + item.id).addClass('blocked');
                } else {
                    $('#' + item.id).removeClass('blocked');
                }
            });
        });
    };

}(jQuery));
