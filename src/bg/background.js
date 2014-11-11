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
  function isExcluded(url) {
    // var excludeState = false;
    var storage = localStorage;
    for (key in storage) {
      if (url.search(storage[key]) > -1) {
        return true;
      }
    }
    return false;
  }

  var excludeState;
  if (changeInfo.hasOwnProperty('pinned')) {
    // The tab was either pinned or unpinned
    console.log('Tab ' + (tab.pinned ? 'is now' : 'is no longer') + ' pinned\n');
    excludeState = isExcluded(tab.url);

    chrome.tabs.sendMessage(tabId, {
      updated: true,
      changed: changeInfo,
      pinnedState: tab.pinned,
      option: localStorage['behavior'],
      exclude: excludeState
    });
  } else if (tab.status === 'complete') {
    // Initial page load complete
    // Or content updates complete
    console.log('Tab update complete');
    console.dir(tab);
    console.log('Tab ' + (tab.pinned ? 'is' : 'is not') + ' pinned\n');
    excludeState = isExcluded(tab.url);

    chrome.tabs.sendMessage(tabId, {
      updated: true,
      changed: changeInfo,
      pinnedState: tab.pinned,
      option: localStorage['behavior'],
      exclude: excludeState
    });
  }
});

/**
 * Retrieve the stored value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
var storedBehavior = localStorage.getItem('behavior');
var radios = document.getElementsByName('behavior');
if (!storedBehavior) {
  // Nothing is in localStorage
  localStorage.setItem('behavior', 'default');
} else if (storedBehavior !== 'external-only') {
  // Ensure localStorage has compatible saved data
  localStorage.setItem('behavior', 'default');
}
