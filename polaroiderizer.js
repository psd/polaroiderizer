    /*
 * Polaroiderizer - slideshow from feeds using jQuery
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*jslint browser: true, onevar: false */
/*global window, escape, jQuery */

(function ($) {

    /*
     *  background tasks
     */
    var running = false;

    function runFeeds() {
        var query = $('#query').val();
        $.whileAsync({
            delay: 300000,
            bulk: 0,
            loop: function () {
                $.fn.polaroidizer.feed.flickr(query); 
            } 
        });
    }

    function runDisplay() {
        $.whileAsync({
            delay: 3000,
            bulk: 0,
            loop: function () {
                console.log("display");

                var item = $('#staging .ready(0)');
                if (!item) {
                    return;
                }
                $(item).transition();

                // update status
                var title = $(item).find('img').attr('title');
                var link = $(item).clone().empty().text(title);
                $('#status').html(link);
            }
        });
    }

    function runTasks() {
        if (running) {
            return;
        }
        running = true;
    }

    /*
     *  UI
     */
    function toggleFullscreen(argument) {
        var display = $('#display');
        $('#title, #form, #controls, #footer').toggle();
        $('body').toggleClass('kiosk');
        display.toggleClass('kiosk');
        if (display.hasClass('kiosk')) {
            var h = $(window).height() + 'px';
            display.height(h);
        } else {
            display.height('500px');
        }
    }

    /*
     *  plugin initialisation
     */
    $.fn.polaroiderizer = function (options) {
        var defaults = {},
            settings = $.extend(true, defaults, options);

        // handle the form submission.
        $('#form').submit(function () {
            var query = $('#query').val();
            window.location.hash = '#' + query;

            $('#staging').empty();

            runTasks();
            return false;
        });

        // get the fragment identifier
        if (window.location.hash) {
            $('#query').val(window.location.hash.split('#')[1]);
            $('form').submit();
        }

        // fullscreen UI selector
        $('a.toggleFullscreen').click(function () {
            toggleFullscreen();
        });
        
        $().keypress(function (e) {
            if (!$(e.target).is('#query')) {
                if (e.which === 102) {
                    toggleFullscreen();
                }
            }
        });

        // transition UI selector
        $('#options a').click(function () {
            var target = $(this);
            if (!target.hasClass('selected')) {
                $('#options a').removeClass('selected');
                target.addClass('selected');
            }
            target.blur();
            return false;
        });
    };

    $.fn.polaroiderizer.statusMessage = function (message) {
        $('#status').html(message);
    };

    $.fn.polaroiderizer.add = function (item) {
        $('<img src="' + item.profile_image_url + '" title="' + item.from_user + '">')
            .load(function () {
                this.addClass("ready");
            })
            .appendTo('#staging');
    };

    // flickr search feed
    $.fn.polaroiderizer.feed.flickr = function (text) {
        this.statusMessage('checking flickr for photo s' + text + '...');
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
                $.fn.polaroiderizer.add({
                    type: 'photo', 
                    user: item.owner,
                    title: item.title, 
                    text: item.description,
                    img: {
                        src: 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.s,
                        href: 'http://flickr.com/photos/' + item.owner + '/' + item.id
                    }
                });
            });
        });
    };

    // twitter search feed
    $.fn.polaroiderizer.feed.twitter = function (text) {
        this.statusMessage('searching twitter for tweets ...');

        var uri = 'http://search.twitter.com/search.json?q=' + escape(text) + '&callback=?';

        $.getJSON(uri, function (data) {
            $.each(data.results, function (i, item) {
                $.fn.polaroiderizer.add({
                    type: 'tweet', 
                    user: item.from_user,
                    avatar: item.profile_image_url, 
                    title: item.from_user, 
                    text: item.text
                });
            });
        });
    };
}(jQuery));
