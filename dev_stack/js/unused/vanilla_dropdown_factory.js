/**
 * Dynamic Dropdown Factory
 */
(function dynamicDropdownsInit(root, factory) {
	// commonjs
	if (typeof exports === 'object') {
		module.exports = factory();
	// global
	} else {
		// run factory
		root.vanillaDynamicDropdowns = factory();
	}
})(this, function() {
	// ACTIVATE DYNAMIC DROPDOWNS
	function dynamicDropdownsFactory(searchFor, inContainer) {
		/**
		 * MODELs
		 */
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
		 * CONTROLLERs
		 */
		this.toggleDD = function(event) {
			var ddcontent = getClosestParent(event.target, this.ddContainer);
			var wrapper = ddcontent.parentNode;
			var ddsiblings = wrapper.childNodes;
			return this.adjacentElementStateHandler(ddcontent, ddsiblings);
		};
		this.initialize = function() {
			for (var i = 0; i < this.ddElms.length; i++) {
				var ddItem = this.ddElms[i];
				this.setEventListener(ddItem, 'click', (this.toggleDD).bind(this) );
				if (i == 0) {
					ddItem.parentNode.classList.add('active');
				}
			}
			return true;
		};
		/**
		 * VIEWs
		 */
		this.adjacentElementStateHandler = function(current, sibilings) {
			if (current.classList.contains('active')) {
				// deactivate already clicked dropdown
				current.classList.remove('active');
			} else {
				// remove all siblings
				this.removeAllActiveClassesFrom(sibilings);
				// activate new clicked dropdown
				current.classList.add('active');
			}
		};
		this.removeAllActiveClassesFrom = function(arrayList) {
			[].forEach.call(arrayList, function(elm) {
				if (elm instanceof HTMLElement) {
					elm.classList.remove('active');
				}
			});
		};
		/**
		 * INITIALIZATION
		 * 
		 * Dynamic Dropdown Operations
		 */
		this.ddElms = document.querySelectorAll(searchFor);
		this.ddContainer = inContainer;
		try {
			if (this.initialize()) {
				console.log('----- dynamic dropdowns initialized -----');
			} else {
				throw 'FAILED: dynamic dropdowns';
			}
		}
		catch(err) {
			console.log(err);
		}
	}
	/**
	 * GLOBALLY ACCESSIBILE FUNCTIONS
	 */
	return {
		make: function(searchFor, inContainer) {
			return new dynamicDropdownsFactory(searchFor, inContainer);
		}
	};
});