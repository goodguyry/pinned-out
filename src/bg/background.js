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
  if (changeInfo.hasOwnProperty('pinned')) {
    // The tab was either pinned or unpinned
    console.log('Tab ' + (tab.pinned ? 'is now' : 'is no longer') + ' pinned\n');
    chrome.tabs.sendMessage(tabId, {updated: true, changed: changeInfo, pinnedState: tab.pinned});
  } else if (tab.status === 'complete') {
    // Initial page load complete
    // Or content updates complete
    console.log('Tab update complete');
    console.dir(tab);
    console.log('Tab ' + (tab.pinned ? 'is' : 'is not') + ' pinned\n');
    chrome.tabs.sendMessage(tabId, {updated: true, changed: changeInfo, pinnedState: tab.pinned});
  }
});
