// Event listener for the save button.
document.getElementById('save').addEventListener('click', function() {
	const urls = document.getElementById('urls').value.split('\n').filter(Boolean); // Extract only non-empty lines from the input.
	const renames = document.getElementById('renames').value.split('\n').filter(Boolean); // Extract only non-empty lines from the input.
	const runInIncognitoOnly = document.getElementById('runInIncognitoOnly').checked;
	const removeIcon = document.getElementById('removeIcon').checked;

	chrome.storage.sync.set({ 'matchedUrls': urls, 'renames': renames, 'runInIncognitoOnly': runInIncognitoOnly, 'removeIcon': removeIcon }, function() {
		if (urls.length === 0) {
			resetAllTabs();
		} else {
			updateAllTabs();
		}
		
		const date = new Date();
		document.getElementById('saveStatus').innerText = `Changes saved on: ${date.toLocaleString()}`;
	});
});

// Loads stored URLs and renames when the options page is loaded.
function loadOptions() {
	chrome.storage.sync.get(['matchedUrls', 'renames', 'runInIncognitoOnly', 'removeIcon'], function(data) {
		if (typeof data.matchedUrls !== 'undefined') {
			document.getElementById('urls').value = data.matchedUrls.join('\n');
		}
		if (typeof data.renames !== 'undefined') {
			document.getElementById('renames').value = data.renames.join('\n');
		}
console.log(data.runInIncognitoOnly);
		document.getElementById('runInIncognitoOnly').checked = data.runInIncognitoOnly !== undefined ? data.runInIncognitoOnly : false;
		document.getElementById('removeIcon').checked = data.removeIcon !== undefined ? data.removeIcon : true;
	});
}

// Load options when the document is fully loaded.
document.addEventListener('DOMContentLoaded', loadOptions);

// Updates titles for all tabs based on stored URLs.
function updateAllTabs() {
	chrome.storage.sync.get(['matchedUrls', 'renames'], function(data) {
		const urls = data.matchedUrls || [];
		const renames = data.renames || [];
		chrome.tabs.query({}, function(tabs) {
			tabs.forEach(tab => {
				if (!isInternalURL(tab.url)) {
					const isMatch = urls.some(storedUrl => tab.url.includes(storedUrl.trim()));
					if (isMatch) {
						const randomText = renames.length > 0 ? renames[Math.floor(Math.random() * renames.length)] : generateRandomText();
						chrome.scripting.executeScript({
							target: { tabId: tab.id },
							func: changeTitle,
							args: [randomText]
						});
					} else {
						chrome.scripting.executeScript({
							target: { tabId: tab.id },
							func: resetTitle
						});
					}
				}
			});
		});
	});
}

/**
 * Checks if the given URL is an internal Chrome URL.
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is internal, otherwise false.
 */
function isInternalURL(url) {
  return url.startsWith('chrome://') || url.startsWith('chrome-extension://');
}

// Resets titles of all tabs.
function resetAllTabs() {
	chrome.tabs.query({}, function(tabs) {
		tabs.forEach(tab => {
			// Skip chrome:// URLs
			if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
				return;
			}
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: resetTitle
			});
		});
	});
}

// Generates random text for tab titles.
function generateRandomText() {
	return Math.random().toString(36).substring(2, 15);
}

// Function to change the tab title to random text.
function changeTitle(randomText) {
	// Store the original title if not already stored.
	if (!document.body.dataset.originalTitle) {
		document.body.dataset.originalTitle = document.title;
	}
	document.title = randomText;
}

// Function to reset the tab title to the original.
function resetTitle() {
	if (document.body.dataset.originalTitle) {
		document.title = document.body.dataset.originalTitle;
	}
}
