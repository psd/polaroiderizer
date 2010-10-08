/*
 * Polaroiderizer - startup module - designed to be changed in a tiddler
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*jslint browser: true, onevar: false */
/*global window, escape, jQuery */

(function ($) {

		$(document).ready(function () {
			$('#display').polaroiderizer({
				query: 'bytenight OR "byte night" OR bytenight2010 OR bytenight10',
				since: '20100801'
			});
			$('#display').polaroiderizer.toggleFullscreen();
		});

}(jQuery));
