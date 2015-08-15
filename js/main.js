
function setHash() {
	var pageTop = $(window).scrollTop();
		document.location.hash = $(this).attr("href");
		$(window).scrollTop(pageTop);
		return false;	
}


function setTab() {
	var tabName = document.location.hash;
	tabName = tabName.substring(1);
	var tabBtn = tabName + "-tabBtn";
	unselectAllTabs();

	// Select current tab
	$('#' + tabBtn).addClass('active');

	$(".tab-content").attr('hidden', 'hidden');
	$('#' + tabName).removeAttr('hidden');
		
}

function unselectAllTabs() {
	$(".tabs li").removeClass('active');
}

function openInNewTab()
{
	var win = window.open('http://www.paulirish.com', '_blank');
  	win.focus();
}


$(document).ready(function(){
	UTILS.addEvent(window, "hashchange", setTab);
	$('#quickTabAnchor').click(setHash);
	$('#fmyTabAnchor').click(setHash);
	$('#teamTabAnchor').click(setHash);
	$('#publicTabAnchor').click(setHash);	

});
