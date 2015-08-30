/* Global Variables */
var quickBookmarks = [];
var foldersBookmarks = [];
var tabHashes = ["#quick-reports", "#my-folders", "#my-team-folders", "#public-folders"];

/* Set URL hash */
function setHash()
{
	var pageTop = $(window).scrollTop();
	document.location.hash = $(this).attr("href");
	$(window).scrollTop(pageTop);
	return false;
}


/* Open the selected tab and mark it as active */
function setTab()
{
	// Get the selected tab
	var tabName = document.location.hash;
	tabName = tabName.substring(1);
	var tabBtn = tabName + "-tabBtn";
	tabName += "-cont";

	unselectAllTabs();

	// Select current tab and open its content
	$('#' + tabBtn).addClass('active-tab');
	$(".tab-content").hide();
	$('#' + tabName).show();

	saveToLocalStorage();		
}


/* Unselect all tab buttons */
function unselectAllTabs()
{
	$(".tabs li").removeClass('active-tab');
}


/* Listener for all keyboard activity, allowing navigation */
function keyboardNav(event)
{
	var key = event.keyCode;
	var currTab = tabHashes.indexOf(document.location.hash);

	// 'Esc' on a Quick Reports form field
	if ((key === 27) && ($.contains($('#quick-reports-cont').get(0), event.target)))
	{
		// Hide settings panel
		toggleVisibility($('#quick-reports-cont .tab-settings-wrap'));
		return true;
	}
	// 'Esc' on a Team Folders form field
	else if ((key === 27) && ($.contains($('#my-team-folders-cont').get(0), event.target)))
	{
		// Hide settings panel
		toggleVisibility($('#my-team-folders-cont .tab-settings-wrap'));
		return true;
	}
	// Check the validity of the current tab and not being inside a form before allowing tab navigation
	else if ((currTab != -1) && !($.contains($('#quick-reports-cont').get(0), event.target)) &&
			 !($.contains($('#my-team-folders-cont').get(0), event.target)))
	{
		// Right arrow
		if ((key === 39) && (currTab < 3))
		{
			// Open next tab
			document.location.hash = tabHashes[currTab + 1];
		}
		// Left arrow
		else if ((key === 37) && (currTab > 0))
		{
			// Open previous tab
			document.location.hash = tabHashes[currTab - 1];
		}
	}
	
	return true;
}


/* Open a link in a new tab */
function openInNewTab(e)
{
	var link = e.target.childNodes[0].href;
	var win = window.open(link, '_blank');
  	win.focus();
}


/* Get the notification from the data file and display it */
function getNotification()
{
	$.get("data/config.json", "json", function(res){
		if (res["notification"])
		{
			// Display notification
			$('.notifications').text(res["notification"]);
			$('.notifications').removeClass('hidden');
		}

	});
}


/* Make a visible element hidden and vise-versa */
function toggleVisibility(el)
{
	// Hidden element
	if (el.hasClass('hidden'))
	{
		// Make visible
		el.removeClass('hidden');
		return true;
	}
	// Visible element
	else
	{
		// Make hidden
		el.addClass('hidden');
		return false;
	}
}


/* Given an element, get the other element in its Name-URL pair */
function getPairedFormField(fieldId)
{
	var pairName = fieldId.substring(0, 8);

	pairName += ((fieldId.endsWith("name")) ? "url" : "name");
	
	return ($('#' + pairName)[0]);
}


/* Make a form field required */
function addRequiredDependency(field)
{
	if(!field.hasAttribute('required'))
	{
		field.setAttribute('required', 'true');
	}
}


/* Make a required form field unrequired */
function removeRequiredDependency(field)
{
	if(field.hasAttribute('required'))
	{
		field.removeAttribute('required');
	}
}


/* Check whether the form inside the given container is fully valid */
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


/* Check whether the given string is a valid URL */
function isURLValid(url)
{
	// Full URL check, allowing neglecting the protocol part - taken from the internet
	var regStr = "^(?!mailto:)(?:(?:http|https|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
				   "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|" +
				   "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*" +
				   "[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)" +
				   "(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$";
	var regExp = new RegExp(regStr, 'i');

	return (regExp.test(url));
}


/* Add Http protocol to a URL string, in case it donesn't have one already */
function prependHttp(url)
{
	var regExp = /^(https?:\/\/)/i;

    if (!regExp.test(url))
    {
		url = "http://" + url;
	}

	return url;
}


/* Save bookmarks settings for the Quick Reports tab */
function saveQuickBookmarks()
{
	$('#quick-reports-cont input:valid').removeClass('warning');
	$('#quick-reports-cont input:invalid').addClass('warning');

	// Check validy of non-empty URL fields
	for(i = 1; i <= 3; i++)
	{
		var urlField = $('#report0' + i + 'url');

		// Check validity
		if ((urlField.get(0).value != "") && (!isURLValid(urlField.get(0).value)))
		{
			urlField.addClass('warning');
			urlField.get(0).setCustomValidity('Please enter a valid URL.');
		}
		else
		{
			urlField.get(0).setCustomValidity('');

			// Only remove warning state for unrequired fields
			if ((urlField.get(0).value != "") || !urlField.get(0).hasAttribute('required'))
			{
				urlField.removeClass('warning');
			}
		}
	}

	// Save the data if the form is valid
	if (isFormValid("quick-reports-cont"))
	{
		// Add 'http' prefix to URLs, if needed
		for(i = 1; i <= 3; i++)
		{
			var urlField = $('#report0' + i + 'url').get(0);

			if (urlField.value != "")
			{
				urlField.value = prependHttp(urlField.value);	
			}			
		}

		// Hide panel
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

		// Fill combobox and and save data to local storage
		populateQuickBookmarks();
		saveToLocalStorage();

		// Hide components incase of no bookmarks
		if (quickBookmarks.length == 0)
		{
			$('#quick-rep-iframe').hide();
			bookmarkCombo.hide();
		}
		// Show components, otherwise
		else
		{
			$('#quick-rep-iframe').show();
			bookmarkCombo.show();
			bookmarkCombo.get(0).selectedIndex = (quickBookmarks.length - 1); // Choose last option
			bookmarkCombo.trigger('change');
		}

		return false;
	}
}


/* Save bookmarks settings for the Team Folders tab */
function saveFoldersBookmarks()
{
	$('#my-team-folders-cont input:valid').removeClass('warning');
	$('#my-team-folders-cont input:invalid').addClass('warning');

	// Check validy of non-empty URL fields
	for(i = 1; i <= 3; i++)
	{
		var urlField = $('#folder0' + i + 'url');

		// Check validity
		if ((urlField.get(0).value != "") && (!isURLValid(urlField.get(0).value)))
		{
			urlField.addClass('warning');
			urlField.get(0).setCustomValidity('Please enter a valid URL.');
		}
		else
		{
			urlField.get(0).setCustomValidity('');

			// Only remove warning state for unrequired fields
			if ((urlField.get(0).value != "") || !urlField.get(0).hasAttribute('required'))
			{
				urlField.removeClass('warning');
			}
		}
	}

	// Save the data if the form is valid
	if (isFormValid("my-team-folders-cont"))
	{
		// Add 'http' prefix to URLs, if needed
		for(i = 1; i <= 3; i++)
		{
			var urlField = $('#folder0' + i + 'url').get(0);

			if (urlField.value != "")
			{
				urlField.value = prependHttp(urlField.value);	
			}			
		}

		// Hide panel
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

		// Fill combobox and and save data to local storage
		populateFoldersBookmarks();
		saveToLocalStorage();

		// Hide components incase of no bookmarks
		if (foldersBookmarks.length == 0)
		{
			$('#team-fold-iframe').hide();
			bookmarkCombo.hide();
		}
		// Show components, otherwise
		else
		{
			$('#team-fold-iframe').show();
			bookmarkCombo.show();
			bookmarkCombo.get(0).selectedIndex = (foldersBookmarks.length - 1); // choose last option
			bookmarkCombo.trigger('change');
		}

		return false;
	}
}


/* Fill the Quick Reports tab bookmarks combobox from the global array */
function populateQuickBookmarks()
{
	for(i = 0; i < quickBookmarks.length; i++)
	{
		$('#quick-reports-cont .bookmarks').append($('<option>', quickBookmarks[i]));
	}
}


/* Fill the Team Folders tab bookmarks combobox from the global array */
function populateFoldersBookmarks()
{
	for(i = 0; i < foldersBookmarks.length; i++)
	{
		$('#my-team-folders-cont .bookmarks').append($('<option>', foldersBookmarks[i]));
	}
}


/* Save both bookmark collections and last visited tab to local storage */
function saveToLocalStorage()
{
	var dataString = JSON.stringify(quickBookmarks) + '$' + JSON.stringify(foldersBookmarks) + '$' + document.location.hash;
	localStorage.setItem('webappData', dataString);
	return false;
}


/* Fill Quick Reports tab's settings panel with bookmarks from global array */
function populateQuickSettings()
{
	for(i = 0; i < quickBookmarks.length; i++)
	{
		var nameField = "report0" + (i + 1) + "name";
		var urlField = "report0" + (i + 1) + "url";

		// Fill fields and add 'required' dependencies
		$('#' + nameField).get(0).value = quickBookmarks[i].text;
		addRequiredDependency($('#' + nameField).get(0));

		$('#' + urlField).get(0).value = quickBookmarks[i].value;
		addRequiredDependency($('#' + urlField).get(0));
	}
}


/* Fill Team Folders tab's settings panel with bookmarks from global array */
function populateFoldersSettings()
{
	for(i = 0; i < foldersBookmarks.length; i++)
	{
		var nameField = "folder0" + (i + 1) + "name";
		var urlField = "folder0" + (i + 1) + "url";

		// Fill fields and add 'required' dependencies
		$('#' + nameField).get(0).value = foldersBookmarks[i].text;
		addRequiredDependency($('#' + nameField).get(0));

		$('#' + urlField).get(0).value = foldersBookmarks[i].value;
		addRequiredDependency($('#' + urlField).get(0));
	}
}


/* Load both bookmarks collections and last visited tab from local storage */
function loadFromLocalStorage()
{
	var dataString = localStorage.getItem('webappData');
	var prevHash;

	// Fill global arrays if the data is present
	if (dataString)
	{
		quickBookmarks = JSON.parse(dataString.split('$')[0]);
		foldersBookmarks = JSON.parse(dataString.split('$')[1]);
		prevHash = dataString.split('$')[2];
	}	
	
	// Go to the last visited tab, if there is one
	if (prevHash)
	{
		document.location.hash = prevHash;
	}
	// Go to the first tab as default, otherwise
	else
	{
		document.location.hash = "#quick-reports";
	}

	// Fill combos and forms
	populateQuickBookmarks();
	populateFoldersBookmarks();

	populateQuickSettings();
	populateFoldersSettings();

	// Show or hide components according to existance of bookmarks
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


/* Search a bookmarked site by name. If found - jump to it */
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

	// If not found - display a notification
	$('.notifications').removeClass('hidden');
	$('.notifications').text('The searched report \"' + searchVal + '\" was not found.');
	return false;
}


$(document).ready(function(){
	// Init tabs
	document.location.hash = '#quick-reports';
	UTILS.addEvent(window, "hashchange", setTab);
	$('#quickTabAnchor').click(setHash);
	$('#myTabAnchor').click(setHash);
	$('#teamTabAnchor').click(setHash);
	$('#publicTabAnchor').click(setHash);
	$('.tab-content').hide(); 						// hide all tabs
	$('#quick-reports-cont').show(); 				// show quick reports tab

	// Set button events
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

	// Get notification from data file
	getNotification();

	// Set dependency event
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

	// Set save events
	$('#save-rep-form').click(saveQuickBookmarks);
	$('#save-fold-form').click(saveFoldersBookmarks);

	// Set combobox events
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

	// Set search event
	$('#searchGo').click(searchBookmark);

	// Load data from local storage
	loadFromLocalStorage();

	// Set keyboard navigation event
	document.onkeydown = keyboardNav;
});
