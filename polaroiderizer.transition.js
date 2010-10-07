/*
 * Polaroiderizer - slideshow from feeds using jQuery - transitions
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*jslint browser: true, onevar: false */
/*global jQuery */

(function ($) {

    // exectute current transition effect
    $.fn.transition = function () {
        switch ($.fn.polaroiderizer.transition) {
        case 0: 
            return this.polaroidScroll();
        case 1: 
            return this.faders();	
        default:
            return this.plain();	
        }
    };

    $.fn.polaroiderizer.shuffle = function () {
        $.fn.polaroiderizer.transition = Math.floor(Math.random() * 3);
    };

    $.fn.addFrame = function (type) {
        $('#display div.plain').remove();
        var frame = $('<div class="' +  type + '"></div>').append(this);
        $('#display').append(frame);
        var photo = $(this).find('img');
        if (photo.height() > 400) {
            photo.css({height: photo.height() * 0.75, width: photo.width() * 0.75});
        }
        return $(frame).find('div');
    };

    // transition: simplest possible
    $.fn.plain = function () {
        var frame = this.addFrame('plain');
        var x = ($('#display').width() - $(frame).width()) / 2;
        var y = ($('#display').height() - $(frame).height()) / 2;
        frame.css({top: y + 'px', left: x + 'px'});
        return this;				
    };

    // transition: drop down polaroid photos 
    $.fn.polaroidScroll = function () {
        var frame = this.addFrame('polaroid');
        var photo = $(this).find('img');
            
        // set starting point
        var x = 40 + Math.floor(Math.random() * ($('#display').width() - frame.width() - 200));
        var y = frame.height();
        frame.css({ top: '-' + y + 'px', left: x + 'px' });

        // set opacity of photo
        photo.css({ opacity: '0' });

        // animate photo opacity and into view.
        frame.animate({top: '15px'}, 400);
        photo.animate({opacity: '1'}, 6000, function (picture) {
            // animate slowly out of view and opacity of entire object.
            frame.animate({top: $('#display').height() + 'px', opacity: '0'}, 5000, function () {
                frame.remove();
            });	
        });
        return this;				
    };

    // transition: fading animation effect
    $.fn.faders = function () {
        var frame = this.addFrame('faders');
        var x = ($('#display').width() - frame.width()) / 2;
        var y = ($('#display').height() - frame.height()) / 2;
        frame.css({top: y + 'px', left: x + 'px', opacity: '0'});
        frame.animate({opacity: '1'}, 2000, function (pic) {
            frame.animate({opacity: '0'}, 6000, function () {
                frame.remove();
            });				
        });
        return this;				
    };


}(jQuery));
