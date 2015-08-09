


function setHash() {
	/*window.location.hash = 'hello';
	return false;*/
	if(history.pushState)
	{
    	history.pushState(null, null, '#myhash');
	}
}

function setTab() {
		
}


$(document).ready(function(){
	UTILS.addEvent(window, "hashchange", setTab);

	//var innerAnchor = $('#quickTabBtn').children()[0];
	//UTILS.addEvent(innerAnchor, "click", setTab);
	$('#quickTabAnchor').click(function(event) {
		var pageTop = $(window).scrollTop();
		document.location.hash = $(this).attr("href");
		$(window).scrollTop(pageTop);
		return false;
	});
});
