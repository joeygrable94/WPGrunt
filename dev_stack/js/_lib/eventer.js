/*
EVENTER: simple data binding
- data-bind's a data-event to an element, then executes its handler below

IN THEORY:
<element
	data-bind='action'				// DOM event to bind
	data-event='handler'			// handle the event action
	data-more-attrs='more data'		// additional data to be handled
</element>

EXAMPLE:
- this image if bound by a click event
- when the image is clicked on it is handled by the linkTo event
- the linkTo event handler takes an additiional data-link attribute
- the link data is a url passed to redirect the window.location.href to
<img data-bind='click'					// binds image to click event
	data-event='linkTo'					// executes the linkTo handler
	data-link='http://www.url.com'		// takes a link arguement to redirect the URL to
/>
*/
(function($) {
	// when document ready
	$(document).ready(function() {
		
		// DOM global
		let self = $(this);
		let docbody = $('body');

		// EVENTER — pass custom event handlers
		let eventBinder = new EventBinder({
			// toggles elements active state
			toggler: function() {
				// trigger element
				$(this).toggleClass('active');
				// toggled element
				let toggledElement = $(this).data('toggle');
				$(toggledElement).toggleClass('active');
			},
			// redirects to a data-link page url
			linkTo: function(event) {
				let linkTarget = event.target.getAttribute('data-link');
				if (linkTarget) { window.location.href = linkTarget; }
				return;
			},
			// creates a model/lightbox to display the data-view content
			fullscreen: function(event) {}
		});

		// FULLSCREEN lightbox
		var fullscreenBox = $('#fullscreen-lightbox');
		// if no box exists
		if (!fullscreenBox.length) {
			// add lightbox to DOM
			var FS_lightbox = '<div id="fullscreen-lightbox" class="fs-lightbox">';
				FS_lightbox += '<a class="inner-toggle fs-lb-close" data-bind="click" data-event="toggler" data-toggle="#fullscreen-lightbox"><i class="fa fa-plus"></i> exit fullscreen</a>';
				FS_lightbox += '<div class="inner-content">';
				FS_lightbox += '<img class="view-content" />';
				FS_lightbox += '</div></div>';
			docbody.append(FS_lightbox);
		}
		// open fullscreen
		var fullscreenBtnOpen = $('.btn-fullscreen-wrap .btn-fullscreen');
		fullscreenBtnOpen.each(function(index, el) {
			$(el).click(function(event) {
				// update view content & bg color
				var fclb = $('#fullscreen-lightbox');
				var fclb_inner = fclb.children('.inner-content');
				var fclb_img = fclb.find('.view-content')[0];
				var view_src = event.target.getAttribute('data-view');
				var bg_color = event.target.getAttribute('data-bg-color');
				// update fullscreen elements
				docbody.css('overflow', 'hidden');
				$(fclb_img).attr('src', view_src);
				$(fclb_inner).css('background-color', bg_color);
				$(fclb).toggleClass('active');
			});
		});
		// close fullscreen
		$('#fullscreen-lightbox .inner-toggle').click(function(e) {
			$('#fullscreen-lightbox').toggleClass('active');
			docbody.css('overflow', 'auto');
		});


	});
	// EventBinder CLASS
	class EventBinder {
		// construct event handler obj
		constructor(handlers={}, start=true) {
			// elements to bind
			this.toBind = document.querySelectorAll('[data-bind]');
			// obj containing all the event actions
			this.handlers = handlers;
			// if initated
			if (start) { this.init(); }
			return this;
		}
		// updater
		updateEvents() {
			this.toBind = document.querySelectorAll('[data-bind]');
			this.init();
		}
		// bind event actions to DOM elements
		bindEvents() {
			// for each element
			this.toBind.forEach((element, index) => {
				// get variables
				let listener = element.getAttribute('data-bind') || 'click',
					handler = element.getAttribute('data-event'),
					binded = element.getAttribute('data-binded');
				// chech for the event listener in the handlers obj
				if (typeof this.handlers[listener] !== undefined) {
					// if not already bound
					if (!binded) {
						// bind each event to element
						element.setAttribute('data-binded', 'true');
						element.addEventListener(listener, this.handlers[handler]);
					}
				}
			});
		}
		// initiate event binding
		init() { return this.bindEvents(); }
	}
} (jQuery));