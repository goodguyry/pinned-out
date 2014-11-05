/**
 * Send info about the tab to the content script
 *
 * pinnedOut.scriptResponse: Dummy text to print to the console
 * pinnedOut.tabIndex: The tab's index, used to create a new tab
 * pinnedOut.pinnedState: Whether or not the tab is pinned
 */
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var pinnedOut = {};
    pinnedOut.scriptResponse = "response received";
    pinnedOut.tabIndex = sender.tab.index;
    pinnedOut.pinnedState = sender.tab.pinned;
    console.log('inject.js:', request.message);
    if (request.message === 'ready') {
      sendResponse(pinnedOut);
    }
  });

/**
 * Listen for tab updates (e.g., a tab being pinned or unpinned)
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   console.log(changeInfo.pinned);
});
