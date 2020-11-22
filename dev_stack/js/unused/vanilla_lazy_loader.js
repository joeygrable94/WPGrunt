// Vanilla Lazy Loader
function vanillaLazyLoad() {
	// vars config
	var loadCount = 0;
	var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
	var observer = new IntersectionObserver(onIntersection, {
		rootMargin: "".concat(offset, "px ").concat(offset, "px"),
		threshold: 0.01
	});
	// find images
	var LazyImgs = document.querySelectorAll("img[data-src]");
	var LazyVids = document.querySelectorAll("video.vlazy");
	// load images
	var loadElement = function loadElement(htmlElm) {
		var htmlElmSource;
		// check cases
		switch (htmlElm.tagName) {
			case "IMG":
				htmlElmSource = htmlElm.getAttribute("data-src");
				htmlElm.setAttribute("src", htmlElmSource);
				htmlElm.removeAttribute("data-src");
				break;
			case "VIDEO":
				var vsrc = htmlElm.getElementsByTagName('source');
				for (var x = 0; x < vsrc.length; x++) {
					htmlElmSource = vsrc[x].getAttribute("data-src");
					vsrc[x].setAttribute("src", htmlElmSource);
					vsrc[x].removeAttribute("data-src");
				}
				var vloaded = (function() {
					htmlElm.load();
					htmlElm.pause();
				})();
				break;
			default:
				htmlElmSource = htmlElm.getAttribute("data-src");
				htmlElm.style.backgroundImage = "url(".concat(htmlElmSource, ")");
				htmlElm.removeAttribute("data-src");
				break;
		}
		htmlElm.classList.add('ll_complete');
	};
	// when element intersects with screenview 
	function onIntersection(entries) {
		entries.forEach(function (entry) {
			if (entry.intersectionRatio > 0) {
				observer.unobserve(entry.target);
				loadElement(entry.target);
			}
		});
	}
	// loop and load all images
	LazyImgs.forEach(function (img) {
		loadCount++;
		return observer.observe(img);
	});
	LazyVids.forEach(function (vid) {
		loadCount++;
		return observer.observe(vid);
	});
	return console.log('----- lazy loaded #' + loadCount + ' assets -----');
}