/*

Bind this action:
data-bind="click"

To this Event function
data-event="sampleFunction"

// BIND ACTIONS
var toBind = document.querySelectorAll("[data-bind]");
// TO EVENTS
VanillaEventBinder(toBind, {
	sampleFunction: function(event) {
		// do stuff here
	}
}, true);
*/

// VanillaEventBinder CLASS
function VanillaEventBinder(bindTo, handlers, start) {
	// bind event actions to DOM elements
	function bindEvents(bindingTo, handlers) {
		// loop
		for (var x = 0; x < bindingTo.length; x++) {
			// get variables
			var eventElm = bindingTo[x];
			var eventBind = eventElm.getAttribute("data-bind") || "click";
			var eventFunction = eventElm.getAttribute("data-event");
			var binded = eventElm.getAttribute("data-binded");
			// chech for the event handler in the handlers obj
			if (typeof handlers[eventFunction] !== undefined) {
				// if not already bound
				if (!binded) {
					eventElm.setAttribute("data-binded", "true");
					eventElm.addEventListener(eventBind, handlers[eventFunction]);
				}
			}
		}
	}
	// if initated
	if (start) {
		return bindEvents(bindTo, handlers);
	}
}
