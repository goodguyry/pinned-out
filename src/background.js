/**
 * Listen for tab updates
 * Send the information to the content script
 *
 * Relevant tab updates:
 *   - initial load (complete)
 *   - content updates (via ajax for example) (complete)
 *   - pinned
 *   - unpinned
 *
 * @param {Object} changeInfo Information about the event (only concerned with `complete` & `pinned`)
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (tab.pinned) {
    chrome.pageAction.show(tab.id);
  } else {
    chrome.pageAction.hide(tab.id);
  }

  chrome.storage.sync.get(null, function(items) {
    var excludeState = false;
    for (var key in items) {
      if (tab.url.search(items[key]) > -1) {
        excludeState = true;
      }
    }
    chrome.tabs.sendMessage(tabId, {
      updated: true,
      changed: changeInfo,
      pinnedState: tab.pinned,
      // option no longer needs to be passed
      option: items.behavior,
      // exclude no longer needs to be passed
      exclude: excludeState
    });
  });

});

/**
 * Retrieve the stored value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
chrome.storage.sync.get('behavior', function(items) {
  if (!items.behavior) {
    // Nothing is in storage
    chrome.storage.sync.set({'behavior': 'default'});
  } else if (items.behavior !== 'external-only') {
    // Ensure storage has compatible saved data
    chrome.storage.sync.set({'behavior': 'default'});
  }
});
