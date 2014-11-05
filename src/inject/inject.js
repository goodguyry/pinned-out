/**
 * Let background.js know we're ready for tab info
 * Receive info about the tab from the background script
 *
 * response.scriptResponse: Dummy text to print to the console
 * response.tabIndex: The tab's index, used to create a new tab
 * response.pinnedState: Whether or not the tab is pinned
 */
chrome.extension.sendMessage({message: 'ready'}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // This part of the script triggers when page is done loading
      console.log('background.js:', response.scriptResponse);
      console.log('pinned:', response.pinnedState);
      console.log('index:', response.tabIndex);

      if (response.pinnedState) {
        // The tab is pinned
        console.log('Create new tabs');
      } else {
        // The tab is not pinned
        console.log('Do not create new tabs');
      }

    }
  }, 10);
  });

/**
 * Receive message from the background script regarding tab updates
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.pinnedState.hasOwnProperty('pinned')) {
      // The tab updated is related to pinnedState
      if (request.pinnedState.pinned) {
        // The tab was pinned
        console.log('The tab was pinned')
        console.log('Create new tabs');
      } else {
        // The tab was unpinned
        console.log('The tab was unpinned')
        console.log('Do not create new tabs');
      }
    }
  });
