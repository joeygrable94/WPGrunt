// Animate Page Transition Click Handler
var animatePageTransition = function(event) {
	// Prevent default action (e.g. following the link)
	event.preventDefault();
	// Get url from the target element (<a>) href attribute
	var link = getClosestParent(event.target, 'a');
	var url = event.target.href;
	if (url === undefined) { url = link.href; }
	// Get Page loader element
	var loader = document.getElementById('loader-wrapper');
	// Animate page transition before following the link
	loader.classList.remove('complete');
	// follow bound URL after loader transitions
	setTimeout((function() { this.open(url, '_self'); }).bind(window), 20);
};