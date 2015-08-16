
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
	tabName += "-cont";
	unselectAllTabs();

	// Select current tab
	$('#' + tabBtn).addClass('active');
	$(".tab-content").hide();
	$('#' + tabName).show();
		
}

function unselectAllTabs() {
	$(".tabs li").removeClass('active');
}

function openInNewTab(e)
{
	var link = e.target.childNodes[0].href;
	var win = window.open(link, '_blank');
  	win.focus();
}


$(document).ready(function(){
	document.location.hash = '#quick-reports';
	UTILS.addEvent(window, "hashchange", setTab);
	$('#quickTabAnchor').click(setHash);
	$('#fmyTabAnchor').click(setHash);
	$('#teamTabAnchor').click(setHash);
	$('#publicTabAnchor').click(setHash);
	$(".tab-content").hide(); // hide all tabs
	$('#quick-reports-cont').show(); // show quick reports tab
	$(".full-screen-btn").click(openInNewTab);


});
