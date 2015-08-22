
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

function getNotification()
{
	$.get("data/config.json", "json", function(res){
		if (res["notification"])
		{
			$('.notifications').text(res["notification"]);
			$('.notifications').removeClass('hidden');
		}

	});
}

function toggleVisibility(el)
{
	if (el.hasClass('hidden'))
	{
		el.removeClass('hidden');
		return true;
	}
	else
	{
		el.addClass('hidden');
		return false;
	}
}

function getPairedFormField(fieldId)
{
	var pairName = fieldId.substring(0,8);

	pairName += ((fieldId.endsWith("name")) ? "url" : "name");
	
	return ($('#' + pairName)[0]);
}

function toggleValidationDependency(field)
{
	if(field.hasAttribute('required'))
	{
		field.removeAttr('required');
	}
	else
	{
		field.setAttribute('required', 'true');
	}
}

function addRequiredDependency(field)
{
	if(!field.hasAttribute('required'))
	{
		field.setAttribute('required', 'true');
	}
}

function removeRequiredDependency(field)
{
	if(field.hasAttribute('required'))
	{
		field.removeAttribute('required');
	}
}

function isFormValid(containerName)
{
	if ($('#' + containerName + ' form:valid').length != 0)
	{
		return true
	}
	else
	{
		return false;
	}
}


$(document).ready(function(){
	document.location.hash = '#quick-reports';
	UTILS.addEvent(window, "hashchange", setTab);
	$('#quickTabAnchor').click(setHash);
	$('#fmyTabAnchor').click(setHash);
	$('#teamTabAnchor').click(setHash);
	$('#publicTabAnchor').click(setHash);
	$('.tab-content').hide(); // hide all tabs
	$('#quick-reports-cont').show(); // show quick reports tab
	$('.full-screen-btn').click(openInNewTab);
	$('#qr-wheel').click(function(){
		if(toggleVisibility($('#quick-reports-cont .tab-settings-wrap')))
		{
			$('#report01name').focus();
		}
	});
	$('#mf-wheel').click(function(){
		if(toggleVisibility($('#my-team-folders-cont .tab-settings-wrap')))
		{
			$('#folder01name').focus();
		}
	});

	$("#report-cancel").click(function() {
		toggleVisibility($('#quick-reports-cont .tab-settings-wrap'));
		return false;
	});

	$("#folders-cancel").click(function() {
		toggleVisibility($('#my-team-folders-cont .tab-settings-wrap'));
		return false;
	});

	getNotification();

	$('.tab-content input').blur(function(event){
		if (event.target.value != "")
		{
			addRequiredDependency(getPairedFormField(event.target.id));
		}
		else
		{
			removeRequiredDependency(getPairedFormField(event.target.id));
		}
	});

	$('#save-rep-form').click(function() {
		$('#quick-reports-cont input:valid').removeClass('warning');
		$('#quick-reports-cont input:invalid').addClass('warning');

		if (isFormValid("quick-reports-cont"))
		{
			toggleVisibility($('#quick-reports-cont .tab-settings-wrap'));
		}
	});

	$('#save-fold-form').click(function() {
		$('#my-team-folders-cont input:valid').removeClass('warning');
		$('#my-team-folders-cont input:invalid').addClass('warning');

		if (isFormValid("my-team-folders-cont"))
		{
			toggleVisibility($('#my-team-folders-cont .tab-settings-wrap'));
		}
	});



	


});
