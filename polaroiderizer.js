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

    /*
     *  background tasks
     */
    var running = false;

    function runFeeds() {
        var query = $('#query').val();
        $.whileAsync({
            delay: 3000000,
            bulk: 0,
            loop: function () {
                $.fn.polaroiderizer.feed.flickr(query); 
            } 
        });
        $.whileAsync({
            delay: 300000,
            bulk: 0,
            loop: function () {
                $.fn.polaroiderizer.feed.twitter(query); 
            } 
        });
    }

    function show(item) {
        //statusMessage('..');
        $(item).clone().transition();
        $(item).addClass('shown');
    }

    function runDisplay() {
        $.whileAsync({
            delay: 6000,
            bulk: 0,
            loop: function () {
                var items = $('#staging .ready').not('.shown');
                if (items.length > 0) {
                    show(items[0]);
                    return;
                }
                $('#staging .ready').removeClass('shown');
            }
        });
    }

    function runTasks() {
        if (running) {
            return;
        }
        running = true;
        runDisplay();
        runFeeds();
    }

    function statusMessage(message) {
        $('#status').html(message);
    }

    /*
     *  plugin initialisation
     */
    $.fn.polaroiderizer = function (options) {
        var defaults = {};
        var settings = $.extend(true, defaults, options);

        // handle the form submission.
        $('#form').submit(function () {
            var query = $('#query').val();
            window.location.hash = '#' + query;
            $('#staging').empty();

            runTasks();
            return false;
        });

        if (settings.query) {
            $('#query').val(settings.query);
            runTasks();
        } else {
            // get the fragment identifier
            if (window.location.hash) {
                $('#query').val(window.location.hash.split('#')[1]);
                $('form').submit();
            }
        }

        // fullscreen UI selector
        $('a.toggleFullscreen').click(function () {
            $.fn.polaroiderizer.toggleFullscreen();
        });
        
        $().keypress(function (e) {
            if (!$(e.target).is('#query')) {
                if (e.which === 102) {
                    $.fn.polaroiderizer.toggleFullscreen();
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

    /*
     *  UI stuff
     */
    $.fn.polaroiderizer.toggleFullscreen = function (argument) {
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
    };


    /*
     *  add item to staging area, which is also the display queue
     */
    $.fn.polaroiderizer.addItem = function (item) {
        if ($("#" + item.id).length > 0) {
            return;
        }
        var polaroid = $('<div class="' + item.type + '" id="' + item.id + '"/>');
        if (item.avatar) {
            $('<img src="' + item.avatar.src + '" title="' + item.title + '">')
                .load(function () {
                    $(this).parent().addClass("ready");
                }).appendTo(polaroid);
        }
        if (item.img) {
            $('<img src="' + item.img.src + '" title="' + item.title + '">')
                .load(function () {
                    $(this).parent().addClass("ready");
                }).appendTo(polaroid);
        } 
        if (item.title) {
            $('<p class="title">' + item.title + ' by <a href="">' + item.user + '</a></p>').appendTo(polaroid);
        } else if (item.text) {
            $('<p class="text">' + item.text + '</p>').appendTo(polaroid);
        }
        polaroid.appendTo('#staging');
    };

    /*
     *  feed handling
     */
    $.fn.polaroiderizer.feed = function () {
    };

    $.fn.polaroiderizer.feed.flickr = function (text) {
        //statusMessage('checking flickr for photos ..');
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
                    text: item.description,
                    img: {
                        src: 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
                        href: 'http://flickr.com/photos/' + item.owner + '/' + item.id
                    }
                });
            });
        });
    };

    $.fn.polaroiderizer.feed.twitter = function (text) {
        //statusMessage('checking twitter for tweets ..');

        var uri = 'http://search.twitter.com/search.json?q=' + escape(text) + '&callback=?';

        $.getJSON(uri, function (data) {
            $.each(data.results, function (i, item) {

                // TBD:- turn twitpics into photos :
                // http://yfrog.com/15vfizj ->  http://yfrog.com/15vfizj:iphone
                // http://twitgoo.com/3ergg -> http://twitgoo.com/3ergg/img
                // http://img.ly/4gx -> http://img.ly/show/thumb/4gx

                $.fn.polaroiderizer.addItem({
                    type: 'tweet', 
                    id: 'twitter_' + item.id,
                    user: item.from_user,
                    avatar: {
                        src: item.profile_image_url, 
                        href: "http://twitter.com/" + escape(item.from_user)
                    },
                    text: item.text
                });
            });
        });
    };

}(jQuery));
