/**
 * Listen for a signal from the content script
 * Send info about the tab to the content script
 *
 * pinnedOut.scriptResponse: Dummy text to print to the console
 * pinnedOut.tabIndex: The tab's index, used to create a new tab
 * pinnedOut.pinnedState: Whether or not the tab is pinned
 */
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var pinnedOut = {};
    pinnedOut.scriptResponse = 'response received';
    pinnedOut.tabIndex = sender.tab.index;
    pinnedOut.pinnedState = sender.tab.pinned;
    console.log('inject.js:', request.message);
    if (request.message === 'ready') {
      // sendResponse(pinnedOut);
    }
  });

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
  if (tab.status === 'complete') {
    // Initial page load complete
    // Or content updates complete
    console.log('Tab update complete');
    console.dir(tab);
    console.log('Tab ' + (tab.pinned ? 'is' : 'is not') + ' pinned\n');
    chrome.tabs.sendMessage(tabId, {updated: true, changed: changeInfo, pinnedState: tab.pinned});
  } else if (changeInfo.hasOwnProperty('pinned')) {
    // The tab was either pinned or unpinned
    console.log('Tab ' + (tab.pinned ? 'is now' : 'is no longer') + ' pinned\n');
    chrome.tabs.sendMessage(tabId, {updated: true, changed: changeInfo, pinnedState: tab.pinned});
  }
});
