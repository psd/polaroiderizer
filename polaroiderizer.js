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


/*
 *  date functions
 */
String.zeroPad = function (n, d)
{
    var s = n.toString();
    if (s.length < d) {
        s = "000000000000000000000000000".substr(0, d - s.length) + s;
    }
    return s;
};


Date.prototype.convertToYYYYMMDDHHMMSSMMM = function ()
{
    return this.getUTCFullYear() + String.zeroPad(this.getUTCMonth() + 1, 2) + String.zeroPad(this.getUTCDate(), 2) + "." + String.zeroPad(this.getUTCHours(), 2) + String.zeroPad(this.getUTCMinutes(), 2) + String.zeroPad(this.getUTCSeconds(), 2) + String.zeroPad(this.getUTCMilliseconds(), 4);
};


/*
 *  twitter relative time
 */
function relative_time(time_value) {
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);

    // last minute dirty hack for BST localtime
    delta = delta - (60 * 60);

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
    } else if (delta < (365 * 24 * 60 * 60)) {
        return (parseInt(delta / 86400, 10)).toString() + ' days ago';
    } else {
        return 'over a year ago';
    }
}

/*
 *  actual time
 */
function actual_time(time_value) {
    var d = Date.parse(time_value);
    return d.toLocaleString();
}


(function ($) {

    /*
     *  background tasks
     */
    var running = false;

    function runFeeds() {
        var query = $('#query').val();
        $.whileAsync({ delay: 600000, bulk: 0, loop: function () {
                $.fn.polaroiderizer.feed.flickr(query);
            }
        });
        $.whileAsync({ delay: 600000, bulk: 0, loop: function () {
                $.fn.polaroiderizer.feed.twitter(query);
            }
        });
    }

    function show(item) {
        $(item).clone().transition();
        $(item).addClass('shown');
    }

    function runDisplay() {
        $.whileAsync({ delay: 6000, bulk: 0, loop: function () {
                var items = $('#staging .ready').not('.shown').not('.blocked');
                if (items.length > 0) {
                    show(items[0]);
                    return;
                }
                $('#staging .ready').removeClass('shown');
            }
        });
        $.whileAsync({ delay: 30000, bulk: 0, loop: function () {
                $.fn.polaroiderizer.shuffle();
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
     *  insert element into a list
     *  brute force :- should really use a binary chop
     */
    function orderedInsert(list, item, cmp) {
        var items = list.children();
        if (!items.length) {
            return item.appendTo(list);
        }
        items.each(function (place) {
            var placenode = $(items[place]);
            if (place === (items.length - 1)) {
                item.insertAfter(placenode);
                return false;
            }
            if (cmp(item, placenode)) {
                item.insertBefore(placenode);
                return false;
            }
        });
        return item;
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
            $('<img src="' + item.img + '" title="' + item.user + ' ' + item.size + '">')
            .load(function () {
                var that = this;
                // TBD: fix lazy loading ..
                window.setTimeout(function () {
                    $(that).closest('div').addClass("ready");
                }, 1000);
            })
        ).appendTo(polaroid);

        if (item.title) {
            $('<p class="title">' + item.title + ' by <a class="author" href="' + item.profile + '">' + item.user + '</a></p>').appendTo(polaroid);
        }

        if (item.text) {
            $('<p class="text"><a class="author" href="' + item.profile + '">' + item.user + '</a> ' + item.text + '</p>').appendTo(polaroid);
        }

        if (item.created) {
            /* $('<p class="time"><a href="' + item.href + '">' + relative_time(item.created) + '</a></p>').appendTo(polaroid); */
            $('<p class="time"><a href="' + item.href + '">' + actual_time(item.created) + '</a></p>').appendTo(polaroid);
            var created = Date.parse(item.created).convertToYYYYMMDDHHMMSSMMM();
            $(polaroid).attr({created: created});
        }

        /*
         *  add to list
         */
        return orderedInsert($('#staging'), polaroid, function (item, place) {
                return place.attr('created') < item.attr('created') ? true : false;
            });
    };

    /*
     *  feed handling
     */
    $.fn.polaroiderizer.feed = function () { };

}(jQuery));
