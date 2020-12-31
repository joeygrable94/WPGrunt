(function VanillaSlideshowInit(root, factory) {
	// commonjs
	if (typeof exports === 'object') {
		module.exports = factory();
	// global
	} else {
		// run factory
		root.vanillaSlideshow = factory();
	}
})(this, function() {
	// slideshow factory builder
	function VanillaSlideshowController(node, context) {
		
		/**
		 * MODEL ACTIONS
		 */
		// set an event listener and bind it to this slideshow instance
		this.setEventListener = function(elm, action, runFunc) {
			var passiveSupported = false;
			try {
				var options = {
					get passive() {
						// This function will be called when the browser
						// attempts to access the passive property.
						passiveSupported = true;
						return false;
					}
				};
				window.addEventListener("test", null, options);
				window.removeEventListener("test", null, options);
			} catch (err) {
				passiveSupported = false;
			}
			return elm.addEventListener(action, runFunc, passiveSupported ? { passive: true } : false);
		};
		/**
		 * CONTROLLERS
		 */
		// show the previous or next slide accordingly
		this.showNewSlide = function(i) {
			// increment or decrement this.counter depending on whether i === 1 or i === -1
			if (i > 0) {
				this.counter = (this.counter + 1 === this.numSlides) ? 0 : this.counter + 1;
			} else {
				this.counter = (this.counter - 1 < 0) ? this.numSlides - 1 : this.counter - 1;
			}
			// hide all slides
			[].forEach.call(this.all_slides, function (elm) {
				elm.classList.remove('slide--visible');
			});
			// show the new current slide and make it visible
			this.current_slide = this.all_slides[this.counter];
			this.current_slide.classList.add('slide--visible');
			// update the counter values
			this.updateCounterValues();
		};
		// update the DOM view counter values
		this.updateCounterValues = function() {
			this.slide_count_current.innerHTML = this.counter+1;
			this.slide_count_total.innerHTML = this.numSlides;
			return true;
		};
		/**
		 * VIEWS
		 */
		this.viewSlideshowFullscreen = function() {
			if (this.slideshow.classList.contains('slide--view--fullscreen')) {
				this.slideshow.classList.remove('slide--view--fullscreen');
				this.btn_fullscreen.innerHTML = "view fullscreen";
				this.doc.body.classList.remove('slide--view--fullscreen');
			
			} else {
				this.slideshow.classList.add('slide--view--fullscreen');
				this.btn_fullscreen.innerHTML = "exit fullscreen";
				this.doc.body.classList.add('slide--view--fullscreen');
			}
		};
		this.viewPrevSlide = function() {
			return this.showNewSlide(-1);
		};
		this.viewNextSlide = function() {
			return this.showNewSlide(1);
		};
		/**
		 * Slideshow Operations
		 */
		this.doc = context;
		this.slideshow = node;
		this.slides_container = this.slideshow.querySelectorAll('.slides-container')[0];
		this.all_slides = this.slides_container.querySelectorAll('.slide');
		this.current_slide = this.all_slides[0];
		// slide controls
		this.btn_fullscreen = this.slideshow.querySelectorAll(".fullscreen-btn")[0];
		this.btn_prev = this.slideshow.querySelectorAll(".slide-control-prev")[0];
		this.btn_next = this.slideshow.querySelectorAll(".slide-control-next")[0];
		this.slide_count = this.slideshow.querySelectorAll(".slide-control-count")[0];
		this.slide_count_current = this.slideshow.querySelectorAll(".slide-control-current")[0];
		this.slide_count_total = this.slideshow.querySelectorAll(".slide-control-total")[0];
		// slide iteration
		this.numSlides = this.all_slides.length;
		this.counter = 0;
		// set slideshow actions
		this.setEventListener(this.btn_prev, "click", (this.viewPrevSlide).bind(this) );
		this.setEventListener(this.btn_next, "click", (this.viewNextSlide).bind(this) );
		this.setEventListener(this.btn_fullscreen, "click", (this.viewSlideshowFullscreen).bind(this) );
		// initialize counter values
		try {
			if (this.updateCounterValues()) {
				console.log('----- slideshow active -----');
			} else {
				throw 'FAILED: slideshow factory';
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	// slideshow plugin actions
	return {
		make: function(DOMNode, cntx) {
			return new VanillaSlideshowController(DOMNode, cntx);
		}
	};
});