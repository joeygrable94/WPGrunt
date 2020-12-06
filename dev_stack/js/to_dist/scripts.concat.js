// wait until DOM ready
ready(function(){

	// DO THINGS

});





/** -------------------------------------------------- **/
/*
 * READY
 * calls functions when DOM is loaded and ready to execute page functions
 */
function ready(callback){
	// in case the document is already rendered
	if (document.readyState!='loading') callback();
	// modern browsers
	else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
	// IE <= 8
	else document.attachEvent('onreadystatechange', function(){
		if (document.readyState=='complete') callback();
	});
	console.log('Ready...');
}