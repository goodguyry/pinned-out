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
    var storage = localStorage;
    // This check can be moved to content-script.js
    // chrome.storage.sync.get(null, function(items) {...});
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

    if (tab.pinned) {
      chrome.pageAction.show(tab.id);
    } else {
      chrome.pageAction.hide(tab.id);
    }

    chrome.tabs.sendMessage(tabId, {
      updated: true,
      changed: changeInfo,
      pinnedState: tab.pinned,
      // option no longer needs to be passed
      option: localStorage['behavior'],
      // exclude no longer needs to be passed
      exclude: excludeState
    });
  } else if (tab.status === 'complete') {
    // Initial page load complete
    // Or content updates complete
    console.log('Tab update complete');
    console.dir(tab);
    console.log('Tab ' + (tab.pinned ? 'is' : 'is not') + ' pinned\n');
    excludeState = isExcluded(tab.url);

    if (tab.pinned) {
      chrome.pageAction.show(tab.id);
    } else {
      chrome.pageAction.hide(tab.id);
    }

    chrome.tabs.sendMessage(tabId, {
      updated: true,
      changed: changeInfo,
      pinnedState: tab.pinned,
      // option no longer needs to be passed
      option: localStorage['behavior'],
      // exclude no longer needs to be passed
      exclude: excludeState
    });
  }
});

/**
 * Retrieve the stored value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
chrome.storage.sync.get('behavior', function(items) {
  var radios = document.getElementsByName('behavior');
  if (!items.behavior) {
    // Nothing is in storage
    chrome.storage.sync.set({'behavior': 'default'});
  } else if (items.behavior !== 'external-only') {
    // Ensure storage has compatible saved data
    chrome.storage.sync.set({'behavior': 'default'});
  }
});
