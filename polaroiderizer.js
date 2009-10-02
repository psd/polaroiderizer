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
        $.whileAsync({ delay: 30000, bulk: 0, loop: function () {
                $.fn.polaroiderizer.feed.flickr(query); 
            } 
        });
        $.whileAsync({ delay: 300000, bulk: 0, loop: function () { 
                //$.fn.polaroiderizer.feed.twitter(query);
            } 
        });
    }

    function show(item) {
        $(item).clone().transition();
        $(item).addClass('shown');
    }

    function runDisplay() {
        $.whileAsync({ delay: 6000, bulk: 0, loop: function () {
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

    function relative_time(time_value) {
        var parsed_date = Date.parse(time_value);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
        if (delta < 60) {
            return 'less than a minute ago';
        } else if (delta < 120) {
            return 'about a minute ago';
        } else if (delta < (45 * 60)) {
            return (parseInt(delta / 60, 10)).toString() + ' minutes ago';
        } else if (delta < (90 * 60)) {
            return 'about an hour ago';
        } else if (delta < (24 * 60 * 60)) {
            return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
        } else if (delta < (48 * 60 * 60)) {
            return '1 day ago';
        } else {
            return (parseInt(delta / 86400, 10)).toString() + ' days ago';
        }
    }

    /*
     *  add item to staging area, which is also the display queue
     */
    $.fn.polaroiderizer.addItem = function (item) {
        if ($("#" + item.id).length > 0) {
            return;
        }
        var polaroid = $('<div class="' + item.type + '" id="' + item.id + '"/>');
        $('<a href="' + item.href + '"></a>').append(
            $('<img src="' + item.img + '" title="' + item.user + '">')
                .load(function () {
                    $(this).closest('div').addClass("ready");
                })).appendTo(polaroid);
    
        if (item.title) {
            $('<p class="title">' + item.title + ' by <a class="author" href="' + item.profile + '">' + item.user + '</a></p>').appendTo(polaroid);
        } else if (item.text) {
            $('<p class="text"><a class="author" href="' + item.profile + '">' + item.user + '</a> ' + item.text + '</p>').appendTo(polaroid);
        }

        if (item.created) {
            $('<p class="time"><a href="' + item.href + '">' + relative_time(item.created) + '</a></p>').appendTo(polaroid);
        }

        polaroid.appendTo('#staging');
    };

    /*
     *  feed handling
     */
    $.fn.polaroiderizer.feed = function () { };

}(jQuery));
