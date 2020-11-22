// Document Script Runner
(function() {

	// GLOBAL VARS
	var doc = document;
	var loader = doc.getElementById('loader-wrapper');

	// window load event
	if (window.attachEvent) { window.attachEvent('onload', loadHandler);
	} else if (window.addEventListener) { window.addEventListener('load', loadHandler, false);
	} else { doc.addEventListener('load', loadHandler, false); }

	// check if user already visited the page previously
	if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
		loader.classList.add('complete');
		setTimeout((function() {
			this.style.display = "none";
		}).bind(loader), 3333);
	}

	// load handler
	function loadHandler() {

		loader.classList.add('complete');
		setTimeout((function() {
			this.style.display = "none";
		}).bind(loader), 3333);

		// Animate Links Page Transition
		var all_links = doc.querySelectorAll('a');
		for (var y = 0; y < all_links.length; y++) {
			all_links[y].addEventListener('click', animatePageTransition);
		}

		// return true to show page
		return true;
	}
})();