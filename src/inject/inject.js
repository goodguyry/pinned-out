/**
 * Let background.js know we're ready for tab info
 * Receive info about the tab from background.js
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

    }
  }, 10);
  });
