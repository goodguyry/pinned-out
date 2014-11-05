var pinnedLinkOut = {};

/**
 * Manipulate anchors such that they open in a new tab
 */
pinnedLinkOut.defineLinkBehavior = function(bool) {
  console.log('Create new tabs');
  // test for target="_blank"
  //    ignore if present
  // add target="_blank"
  // add data-pinned
};

/**
 * Remove the DOM changes created via defineLinkBehavior
 */
pinnedLinkOut.revertLinkBehavior = function() {
  console.log('Revert tab behavior');
  // test for data-pinned attribute
  //    ignore if not present
  // remove target attribute
  // remove data-pinned attribute
};

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
        pinnedLinkOut.defineLinkBehavior();
      } else {
        // The tab is not pinned
        // Do nothing
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
        pinnedLinkOut.defineLinkBehavior();
      } else {
        // The tab was unpinned
        pinnedLinkOut.revertLinkBehavior();
      }
    }
  });
