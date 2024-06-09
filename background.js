chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	// Execute only if the tab update is complete and the URL is not an internal one.
	if (changeInfo.status === 'complete' && !isInternalURL(tab.url)) {
		// Get settings data from storage.
		chrome.storage.sync.get(['matchedUrls', 'renames', 'runInIncognitoOnly', 'removeIcon'], function (data) {
			const urls = data.matchedUrls || [];
			const renames = data.renames || [];
			const runInIncognitoOnly = typeof data.runInIncognitoOnly === 'undefined' ? false : data.runInIncognitoOnly;
			const removeIcon = typeof data.removeIcon === 'undefined' ? true : data.removeIcon;
		
			// Check if the current tab's URL matches any of the stored URLs.
			const isMatch = urls.some(storedUrl => tab.url.includes(storedUrl.trim()));
		
			if (isMatch) {
				// Only execute if the runInIncognitoOnly setting is disabled or the tab is in Incognito mode.
				if (!runInIncognitoOnly || tab.incognito) {
						const randomText = getRandomText(renames);
						chrome.scripting.executeScript({
						target: {tabId: tabId},
						func: changeTitleAndReplaceIcon,
						args: [randomText, removeIcon]
						});
				}
			}
		});
	}
});

/**
 * Return random entry from the possible stored renames. Defaults to "Google" if none are set.
 * @param {Array} renames - An array of possible rename values. Array may be empty.
 */
function getRandomText(renames) {
	return renames.length > 0 ? renames[Math.floor(Math.random() * renames.length)] : 'Google';
}

/**
 * Checks if the given URL is an internal Chrome URL.
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is internal, otherwise false.
 */
function isInternalURL(url) {
	return url.startsWith('chrome://') || url.startsWith('chrome-extension://');
}

// Opens the options page when the user clicks on the extension icon.
chrome.action.onClicked.addListener(function (tab) {
	chrome.runtime.openOptionsPage();
});

// Change title and replace icon with an empty one.
function changeTitleAndReplaceIcon(randomText, removeIcon) {
	if (!window.originalTitle) {
		window.originalTitle = document.title;
	}
	document.title = randomText;

	if (removeIcon) {
		const replaceFavIcon = () => {
			const links = document.querySelectorAll('link[rel*="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
			const blankIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAnIB6HFbMgAAAABJRU5ErkJggg==';
			links.forEach(link => {
				if (link.href !== blankIcon) {
					link.href = blankIcon;
				}
			});
		};

	replaceFavIcon(); // Only for matched tabs.

	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.tagName === 'LINK' && (node.rel.includes('icon') || node.rel === 'shortcut icon' || node.rel === 'apple-touch-icon')) {
					if (node.href !== blankIcon) {
						node.href = blankIcon;
					}
				}
			});
		if (document.title !== randomText) {
			document.title = randomText;
		}
		});
	});

	observer.observe(document.head, { childList: true, subtree: true });
	window.mutationObserver = observer;
	}
}
