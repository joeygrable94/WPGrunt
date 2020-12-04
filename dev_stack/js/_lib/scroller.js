// SCROLLER
(function($) {
	// when document ready
	$(document).ready(function() {
		// vars
		let doc = $(this);
		let $scrollers = $('.scroller');
		// check scrollers exists
		if ($scrollers.length) {
			// create new scroller for each one
			$scrollers.each((index, elm) => new scroller(elm));
		}
	});
	// SCROLLER
	class scroller {
		// BUILD
		constructor(container) {
			// VARS
			let self = this;
			self.container = $(container);
			self.deck = self.container.children('.deck');
			self.slides = self.deck.children('img');
			self.arrows = self.container.children('.scroller-arrows');
			self.numSlides = self.slides.length;
			self.totalWidth = 0;
			self.inSlideshow = false;
			self.slideshowStop = false;
			// POSITION SLIDES
			self.positionScrollerImages();
			// HANDLE SCROLL
			// on MOUSEOVER
			self.container.mouseover(function() {
				self.slideshowStop = false;
				$(this).mousewheel(function(e, delta) {
					self.scrollerJack(this, e, delta);
				});
			// on MOUSELEAVE
			}).mouseleave(function() {
				self.slideshowStop = true;
				$(this).unbind('mousewheel');
			});
			// on MOUSEMOVE
			self.container.mousemove(function() {
				// check mouse positioned in scroller window
				if (self.deck[0] == event.target.parentNode) {
					self.slideshowStop = false;
					$(this).mousewheel(function(e, delta) {
						self.scrollerJack(this, e, delta);
					});
				} else {
					self.slideshowStop = true;
					$(this).unbind('mousewheel');
				}
			});
			// click ARROWS
			self.arrows.click(function(event) {
				self.activeAutoScroll(event);
			});
		}
		// GETTERS & SETTERS
		getTotalWidth() { return this.totalWidth; }
		setTotalWidth(val) {
			if (val) {
				this.totalWidth = val;	
			}
			return this.totalWidth;
		}
		// POSITIONER
		positionScrollerImages() {
			for (let i = 0; this.numSlides && i < this.numSlides; i++) {
				// vars
				var $slide = $(this.slides[i]),
					$slideWidth = $slide.outerWidth(),
					$scrollerWidth = this.getTotalWidth();
				// position image
				$slide.css('left', $scrollerWidth);
				// update scroller total width
				if (i < this.numSlides - 1) {
					var newWidth = $scrollerWidth+$slideWidth;
					this.setTotalWidth(newWidth);
				}
			}
		}
		// SCROLLING FUNCTION
		scrollerJack(context, e, delta) {
			// map vertical scrolling horizontally
			context.scrollLeft -= (delta);
			e.preventDefault();
			// hide scroller arrows
			this.hideScrollerArrows(context);
			// vars
			var scrollPos = $(context).scrollLeft(),
				scrollerWidth = Math.round(scrollPos + $(context).innerWidth()),
				maxWidth = $(context)[0].scrollWidth;
			// STOP SCROLLER and continue scrolling the WINDOW when:
			// 1) if reaches start of scroller
			if (0 >= scrollPos) {
				$(context).unbind('mousewheel');
			}
			// 2) if reaches end of scroller
			if(this.slideshowStop === false && scrollerWidth >= maxWidth) {
				this.slideshowStop = true;
				$(context).unbind('mousewheel');
			}
			// 3) back-up, if the mouse leaves scroller div
			if (this.deck[0] != e.target.parentNode) {
				$(context).unbind('mousewheel');
			}
		}
		// HIDE SCROLLER ARROWS
		hideScrollerArrows(element) {
			$(element).children('.scroller-arrows').fadeOut('250');
		}
		// AUTO SCROLLING
		activeAutoScroll(event) {
			var start = this.container.scrollLeft(),
				end = this.getTotalWidth(),
				change = end - start,
				currentTime = 0,
				increment = 20,
				duration = 5000; // 5 sec.
		}
	}
} (jQuery));

// HELPER FUNCTIONS
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};