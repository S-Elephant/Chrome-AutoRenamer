# Auto Renamer Chrome Extension

## Overview

Auto Renamer is a Chrome extension designed to enhance your browsing experience by automatically renaming (and optionally removing tab-icons) tabs if a part of the URL matches with any of the URLs specified by the user in the options page.

## Features

- Automatically renames tabs based on user-defined URL patterns.
- Easy-to-use options page for managing URL patterns.
- Seamlessly integrates with Chrome's tab management.
- Optionally only works in incognito mode if desired.

## Installation

### From the Chrome Web Store

1. Open Chrome and go to the Chrome Web Store.
2. Find this extension.
3. Click "Add to Chrome" to install the extension.
4. Confirm the installation by clicking "Add Extension" in the popup.

### Manual Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you downloaded or cloned this repository.
5. The AutoRenamer extension should now be visible in your extensions list.

### Enabling Auto Renamer in Incognito Mode

1. Open Chrome and navigate to `chrome://extensions/`.
2. Find the Auto Renamer extension in the list of installed extensions.
3. Click on the "Details" button for the Auto Renamer extension.
4. Scroll down to the `Allow in incognito` section.
5. Toggle the switch to enable the extension in incognito mode.

This extension will now also function in incognito mode, muting tabs based on your specified URL patterns. If you want it to **exclusively** work in incognito mode then you should enable the Auto Renamer option incognito slider for that as well.

## Usage

1. Click on the icon of this extension in the Chrome toolbar to open the options page.
2. Enter the URLs or URL patterns that you want to rename (one per line).
3. Optional: Enter the random rename values (one per line) for tabs to be renamed into.
4. Optional: Modify other options.
5. Save your changes.
6. The extension will now automatically rename tabs (and optionally replace their icons) that match any of the specified URL patterns.

## Options Page

The options page allows you to manage the list of URL patterns. Each pattern should be a part of the URL that you want to rename. For example, if you want to rename all tabs from `example.com`, you can simply add `example.com` to the list.

------

### Example URL Patterns

- `example.com` - Renames all tabs with URLs containing `example.com`.
- `news` - Renames all tabs with URLs containing `news`.
- `youtube` - Renames all YouTube video tabs.

## Troubleshooting

If the extension is not working as expected, try the following steps:

1. Ensure that the extension is enabled in `chrome://extensions/`.
2. Verify that the URL patterns are correctly entered in the options page.
3. Reload the tabs that should be renamed. If it doesn't work, close and re-open them again or restart Chrome.
4. For use in incognito mode, ensure that you gave it permissions to work in incognito mode.
