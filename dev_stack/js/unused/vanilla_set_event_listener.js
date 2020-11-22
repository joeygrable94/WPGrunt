// assign a function name to a specific element passively
setEventListener = function(elm, action, runFunc) {
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