var quickBookmarks = [];
var foldersBookmarks = [];


function setHash() {
	var pageTop = $(window).scrollTop();
		document.location.hash = $(this).attr("href");
		$(window).scrollTop(pageTop);
		saveToLocalStorage();
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


function isURLValid(url)
{
	var regExp = /^(?:(?:https?|ftp):\/\/)*(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
	return (regExp.test(url));
}


function saveQuickBookmarks()
{
	$('#quick-reports-cont input:valid').removeClass('warning');
	$('#quick-reports-cont input:invalid').addClass('warning');

	/*if (!isURLValid($('#report01url').get(0).value))
	{
		$('#report01url').get(0).setCustomValidity("Error!");
	}*/

	if (isFormValid("quick-reports-cont"))
	{
		toggleVisibility($('#quick-reports-cont .tab-settings-wrap'));

		// Remove previous bookmarks
		quickBookmarks = [];
		var bookmarkCombo = $('#quick-reports-cont .bookmarks');
		bookmarkCombo.empty();

		// Add new bookmarks
		for(i = 1; i <= 3; i++)
		{
			var nameField = "report0" + i + "name";
			if ($('#' + nameField).get(0).value != "")
			{
				var urlField = "report0" + i + "url";
				var record = {value: $('#' + urlField).get(0).value , text: $('#' + nameField).get(0).value};
				quickBookmarks.push(record);
			}
		}

		populateQuickBookmarks();
		saveToLocalStorage();

		if (quickBookmarks.length == 0)
		{
			$('#quick-rep-iframe').hide();
			bookmarkCombo.hide();
		}
		else
		{
			$('#quick-rep-iframe').show();
			bookmarkCombo.show();
			bookmarkCombo.trigger('change');
		}
	}
	return false;
}


function saveFoldersBookmarks()
{
	$('#my-team-folders-cont input:valid').removeClass('warning');
	$('#my-team-folders-cont input:invalid').addClass('warning');

	if (isFormValid("my-team-folders-cont"))
	{
		toggleVisibility($('#my-team-folders-cont .tab-settings-wrap'));

		// Remove previous bookmarks
		foldersBookmarks = [];
		var bookmarkCombo = $('#my-team-folders-cont .bookmarks');
		bookmarkCombo.empty();

		// Add new bookmarks
		for(i = 1; i <= 3; i++)
		{
			var nameField = "folder0" + i + "name";
			if ($('#' + nameField).get(0).value != "")
			{
				var urlField = "folder0" + i + "url";
				var record = {value: $('#' + urlField).get(0).value , text: $('#' + nameField).get(0).value};
				foldersBookmarks.push(record);
			}
		}

		populateFoldersBookmarks();
		saveToLocalStorage();

		if (foldersBookmarks.length == 0)
		{
			$('#team-fold-iframe').hide();
			bookmarkCombo.hide();
		}
		else
		{
			$('#team-fold-iframe').show();
			bookmarkCombo.show();
			bookmarkCombo.trigger('change');
		}
	}
	return false;
}


function populateQuickBookmarks()
{
	for(i = 0; i < quickBookmarks.length; i++)
	{
		$('#quick-reports-cont .bookmarks').append($('<option>', quickBookmarks[i]));
	}
}


function populateFoldersBookmarks()
{
	for(i = 0; i < foldersBookmarks.length; i++)
	{
		$('#my-team-folders-cont .bookmarks').append($('<option>', foldersBookmarks[i]));
	}
}


function saveToLocalStorage()
{
	var dataString = JSON.stringify(quickBookmarks) + '$' + JSON.stringify(foldersBookmarks) + '$' + document.location.hash;
	localStorage.setItem('webappData', dataString);
	return false;
}


function populateQuickSettings()
{
	for(i = 0; i < quickBookmarks.length; i++)
	{
		var nameField = "report0" + (i + 1) + "name";
		var urlField = "report0" + (i + 1) + "url";

		$('#' + nameField).get(0).value = quickBookmarks[i].text;
		$('#' + urlField).get(0).value = quickBookmarks[i].value;
	}
}


function populateFoldersSettings()
{
	for(i = 0; i < foldersBookmarks.length; i++)
	{
		var nameField = "folder0" + (i + 1) + "name";
		var urlField = "folder0" + (i + 1) + "url";

		$('#' + nameField).get(0).value = foldersBookmarks[i].text;
		$('#' + urlField).get(0).value = foldersBookmarks[i].value;
	}
}


function loadFromLocalStorage()
{
	var dataString = localStorage.getItem('webappData');
	quickBookmarks = JSON.parse(dataString.split('$')[0]);
	foldersBookmarks = JSON.parse(dataString.split('$')[1]);
	var prevHash = dataString.split('$')[2];
	
	if (prevHash)
	{
		document.location.hash = prevHash;
	}

	populateQuickBookmarks();
	populateFoldersBookmarks();

	populateQuickSettings();
	populateFoldersSettings();

	if (quickBookmarks.length != 0)
	{
		$('#quick-reports-cont .bookmarks').get(0).selectedIndex = 0;
		$('#quick-reports-cont .bookmarks').trigger('change');
		$('#quick-reports-cont .tab-settings-wrap').addClass('hidden');
	}
	else
	{
		$('#quick-rep-iframe').hide();
		$('#quick-reports-cont .bookmarks').hide();
	}

	if (foldersBookmarks.length != 0)
	{
		$('#my-team-folders-cont .bookmarks').get(0).selectedIndex = 0;
		$('#my-team-folders-cont .bookmarks').trigger('change');
		$('#my-team-folders-cont .tab-settings-wrap').addClass('hidden');
	}
	else
	{		
		$('#team-fold-iframe').hide();
		$('#my-team-folders-cont .bookmarks').hide();
	}
}


function searchBookmark(event)
{
	event.preventDefault();
	var searchVal = $('#q').get(0).value.toLowerCase();

	// First search in the Quick Reports bookmarks
	for(i = 0; i < quickBookmarks.length; i++)
	{
		if (quickBookmarks[i].text.toLowerCase().indexOf(searchVal) != -1)
		{
			// Open Quick Reports tab
			$('#quickTabAnchor').trigger('click');
			$('#quick-reports-cont .bookmarks').get(0).selectedIndex = i;
			$('#quick-reports-cont .bookmarks').trigger('change');

			return false;
		}
	}

	// Only then search in the Team Folders bookmarks
	for(i = 0; i < foldersBookmarks.length; i++)
	{
		if (foldersBookmarks[i].text.toLowerCase().indexOf(searchVal) != -1)
		{
			// Open Team Folders tab
			$('#teamTabAnchor').trigger('click');
			$('#my-team-folders-cont .bookmarks').get(0).selectedIndex = i;
			$('#my-team-folders-cont .bookmarks').trigger('change');

			return false;
		}
	}

	$('.notifications').removeClass('hidden');
	$('.notifications').text('The searched report \"' + searchVal + '\" was not found.');
	return false;
}


$(document).ready(function(){
	document.location.hash = '#quick-reports';
	UTILS.addEvent(window, "hashchange", setTab);
	$('#quickTabAnchor').click(setHash);
	$('#myTabAnchor').click(setHash);
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

	$('#save-rep-form').click(saveQuickBookmarks);

	$('#save-fold-form').click(saveFoldersBookmarks);

	$('#quick-reports-cont .bookmarks').change(function() {
    	var selectedURL = this.value;
    	$('#quick-rep-iframe').attr('src',selectedURL);
    	var expandAnchor = $('#quick-reports-cont .full-screen-btn').get(0).children[0];
    	expandAnchor.setAttribute('href', selectedURL);
	});

	$('#my-team-folders-cont .bookmarks').change(function() {
    	var selectedURL = this.value;
    	$('#team-fold-iframe').attr('src',selectedURL);
    	var expandAnchor = $('#my-team-folders-cont .full-screen-btn').get(0).children[0];
    	expandAnchor.setAttribute('href', selectedURL);
	});

	$('#murik').click(searchBookmark);

	loadFromLocalStorage();



});
