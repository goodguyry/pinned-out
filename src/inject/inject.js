var pinnedLinkOut = {};

/**
 * Manipulate anchors such that they open in a new tab
 *
 * @param {Object} anchor The anchor element currently being iterated over
 */
pinnedLinkOut.addTargetAttribute = function(anchor) {
  console.log('Create new tabs');
  // Test for target="_blank"
  // We don't want to add target attributes where they already exist
  var target = anchor.getAttribute('target');
  if (!target) {
    // Add target="_blank"
    anchor.setAttribute('target', '_blank');
    // Add data-pinned to flag anchors we've updated
    anchor.setAttribute('data-pinned', '');
  }
};

/**
 * Remove the DOM changes created via addTargetAttribute
 *
 * @param {Object} anchor The anchor element currently being iterated over
 */
pinnedLinkOut.removeTargetAttribute = function(anchor) {
  console.log('Revert tab behavior');
  // Test for the data-pinned attribute
  // Only remove the target attribute from anchors with data-pinned
  // This way we avoid removing attributes added by the author
  var dataPinnned = anchor.getAttribute('data-pinned');
  if (!dataPinnned) {
    // Remove target attribute
    anchor.removeAttribute('target');
    // Remove data-pinned attribute
    anchor.removeAttribute('data-pinned');
  }
};

/**
 * Iterate over page's anchors
 *
 * @param {Boolean} pinned Whether or not the tab is pinned
 */
pinnedLinkOut.manipulateAnchors = function(pinned) {
  // Define `pinned` for good measure
  if (pinned === undefined) {
    pinned = false;
  }
  // Collect anchor elements
  var anchors = document.getElementsByTagName('a');
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    // Test for href with # at the end
    // Or hrefs that are nothing but '#'
    // This probably isn't perfect, but it works in limited testing
    var hrefEnd = anchor.href.substring(anchor.href.length -1);
    if (hrefEnd && hrefEnd !== '#') {
      if (pinned) {
        pinnedLinkOut.addTargetAttribute(anchor)
      } else if (!pinned) {
        pinnedLinkOut.removeTargetAttribute(anchor)
      }
    }
  }
};

/**
 * Let the background script know we're ready for tab info
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
        pinnedLinkOut.manipulateAnchors(true);
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
    if (request.changed.hasOwnProperty('pinned')) {
      if (request.changed.pinned) {
        // the tab is now pinned; it previously wasn't
        pinnedLinkOut.manipulateAnchors(true);
      }
      if (!request.changed.pinned) {
        // the tab was unpinned
        pinnedLinkOut.manipulateAnchors(false);
      }
    }

    if (request.changed.status === 'complete') {
      if (request.pinnedState) {
        // the tab is pinned
        pinnedLinkOut.manipulateAnchors(true);
      }
    }
  });
