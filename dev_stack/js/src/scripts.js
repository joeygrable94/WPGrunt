

// Display navigation after event
function showOrHideNavigation(e) {
	// get vars
	var toggle = this,
		toggle_elms = toggle.childNodes,
		toggle_ham = toggle_elms[0],
		toggle_text = toggle_elms[toggle_elms.length-1],
		toggle_find = this.getAttribute('data-toggle'),
		toggle_navigation = document.getElementById(toggle_find);
	// show or hide
	if (toggle_navigation.classList.contains('active')) {
		// hide nav dropdown
		toggle.classList.remove('active');
		toggle_navigation.classList.remove('active');
		toggle_ham.innerHTML = '|||';
		toggle_text.innerHTML = 'menu';
		// enable body scrolling again
		window.toggle_docbody.style.overflowY = 'scroll';
		window.toggle_docbody.style.position = '';
		window.toggle_docbody.style.top = '';
		// scroll to the last available scrollY position
		window.scrollTo(0, window.toggle_scrollY);
	// not yet active
	} else {
		// update the scroll top offset
		window.toggle_scrollY = window.pageYOffset;
		// show nav dropdown
		toggle.classList.add('active');
		toggle_navigation.classList.add('active');
		toggle_ham.innerHTML = 'x';
		toggle_text.innerHTML = 'close';
		// disable body scroll
		window.toggle_docbody.style.overflowY = 'hidden';
		window.toggle_docbody.style.position = 'fixed';
		window.toggle_docbody.style.top = '-'+window.toggle_scrollY+'px';
	}
}


// wait until DOM ready
ready(function(){
	// nav toggles
	var toggle_navs = document.getElementsByClassName('toggle-menu');
	var toggle_docbody = document.body || document.documentElement;
	window.toggle_docbody = document.body || document.documentElement;
	window.toggle_scrollY = 0;
	// loop all toggleable navs
	Array.prototype.forEach.call(toggle_navs, function(nav) {
		// listen to clicks on this nav element
		setEventListener(nav, 'click', showOrHideNavigation);
	});

});

