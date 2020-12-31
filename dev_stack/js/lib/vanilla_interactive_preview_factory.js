// interactivePreviewInit
(function interactivePreviewInit(root, factory) {
	// commonjs
	if (typeof exports === 'object') {
		module.exports = factory();
	// global
	} else {
		// run factory
		root.vanillaInteractivePreview = factory();
	}
})(this, function() {
	// slideshow factory builder
	function interactivePreviewController(node, context) {
		// CONTROLLERS
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
		this.initialize = function() {
			// loop each preview	
			for (i =0; i < this.all_previews.length; i++) {
				// each preview
				var preview = this.all_previews[i];
				var marquees = preview.querySelectorAll('.marquee');
				var videoMarquee = marquees[0];
				var contentMarquee = marquees[1];
				// await events
				this.setEventListener(preview, 'mouseenter', (this.startPreview).bind(this) );
				this.setEventListener(preview, 'mouseleave', (this.stopPreview).bind(this) );
			}
			return true;
		};
		// EVENT ACTIONS
		this.togglePreview = function(event) {
			var element = event.target;
			var ipparent = getClosestParent(element, '.preview-container');
			var isactive = ipparent.classList.contains('active');
			console.log('clicked');
		};
		this.startPreview = function(event) {
			var element = event.target;
			var ipparent = getClosestParent(element, '.preview-container');
			var elmVideo = ipparent.querySelectorAll('.preview-video video')[0];
			this.active_preview = ipparent;
			// actions
			this.resetActivePreviews();
			this.startPreviewStatus();
			setTimeout( (function() {
				this.startVideo(elmVideo);
			}).bind(this), 555);
		};
		this.stopPreview = function(event) {
			var element = event.target;
			var ipparent = getClosestParent(element, '.preview-container');
			var elmVideo = ipparent.querySelectorAll('.preview-video video')[0];
			this.active_preview = ipparent;
			// actions
			this.resetActivePreviews();
			this.stopPreviewStatus();
			this.stopVideo(elmVideo);
		};
		// MODEL ACTIONS
		this.resetActivePreviews = function() {
			this.all_previews.forEach(function(element, index) {
				return element.classList.remove('active');
			});
		};
		this.showActivePreview = function() {	return this.active_preview.classList.add('active'); };
		this.hideActivePreview = function() {	return this.active_preview.classList.remove('active'); };
		this.startPreviewStatus = function() {	return this.active_preview.classList.add('active'); };
		this.stopPreviewStatus = function() {	return this.active_preview.classList.remove('active'); };
		this.startVideo = function(videlm) {	return videlm.play(); };
		this.stopVideo =  function(videlm) {	return videlm.pause(); };
		// Interactive Preview Operations
		this.doc = context;
		this.preview_container = node;
		this.all_previews = this.preview_container.querySelectorAll('.preview-container');
		this.active_preview = null;
		// INITIALIZATION
		try {
			if (this.initialize()) {
				console.log('----- interactive previews active -----');
			} else { throw 'FAILED: interactive previews'; }
		}
		catch(err) { console.log(err); }
	}
	// slideshow plugin actions
	return {
		make: function(DOMNode, cntx) {
			return new interactivePreviewController(DOMNode, cntx);
		}
	};
});