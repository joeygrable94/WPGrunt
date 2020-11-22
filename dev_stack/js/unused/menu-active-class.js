// adds active class to active links
(function($) {
	// when document ready
	$(document).ready(function() {
		var path = location.href;
		if (path) {
			$('.menu a[href="' + path + '"]').addClass('current');
		}
	});
} (jQuery));