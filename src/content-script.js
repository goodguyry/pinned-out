var pinnedOut = {};

/**
 * Manipulate anchors such that they open in a new tab
 *
 * @param {Object} anchor The anchor element currently being iterated over
 */
pinnedOut.addTargetAttribute = function(anchor) {
  // Test for target="_blank"
  // We don't want to add target attributes where they already exist
  var target = anchor.getAttribute('target');
  if (!target) {
    console.log('Create new tabs');
    // Add target="_blank"
    anchor.setAttribute('target', '_blank');
    // Add data-pinnedOut to flag anchors we've updated
    anchor.setAttribute('data-pinnedOut', 'pinned');
  }
};

/**
 * Remove the DOM changes created via addTargetAttribute
 *
 * @param {Object} anchor The anchor element currently being iterated over
 */
pinnedOut.removeTargetAttribute = function(anchor) {
  // Test for the data-pinnedOut attribute
  // Only remove the target attribute from anchors with data-pinnedOut
  // This way we avoid removing attributes added by the author
  var dataPinnned = anchor.getAttribute('data-pinnedOut');
  if (dataPinnned) {
    console.log('Revert tab behavior');
    // Remove target attribute
    anchor.removeAttribute('target');
    // Remove data-pinnedOut attribute
    anchor.removeAttribute('data-pinnedOut');
  }
};

/**
 * Iterate over page's anchors
 *
 * @param {Boolean} pinned Whether or not the tab is pinned
 */
pinnedOut.manipulateAnchors = function(pinned) {
  // Define `pinned` for good measure
  if (pinned === undefined) {
    pinned = false;
  }
  // Collect anchor elements
  var anchors = document.getElementsByTagName('a');
  // Get page's host
  var host = window.location.host;

  // Check saved option
  var externalOnly;
  if (pinnedOut.option === 'external-only') {
    externalOnly = true;
  } else {
    externalOnly = false;
  }

  //Test whether or not the link is an external link
  function isExternal(anchorHost, host) {
    if (anchorHost !== host) {
      // This is an external link
      return true;
    } else {
      return false;
    }
  }

  // Iterate over anchors, testing for various scenarios along the way
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    if (pinned) {
      // The tab is pinned
      if (externalOnly) {
        // The 'external-only' option is set
        if (isExternal(anchor.host, host)) {
          // This is an external link
          // Add target and data attributes
          pinnedOut.addTargetAttribute(anchor);
        } // else do nothing
      } else {
        // The default option is set
        // Test for href with # at the end
        // Or hrefs that are nothing but '#'
        // This probably isn't perfect, but it works in limited testing
        var hrefEnd = anchor.href.substring(anchor.href.length -1);
        if (hrefEnd && hrefEnd !== '#') {
          // Add target and data attributes
          pinnedOut.addTargetAttribute(anchor);
        } // else do nothing
      }
    } else {
      // The tab is not pinned
      pinnedOut.removeTargetAttribute(anchor);
    }
  }
};

/**
 * Receive message from the background script regarding tab updates
 *
 * @param {Object}  request.changed The tab update event
 * @param {Boolean} request.changed.pinned The tab was pinned or unpinned
 * @param {String}  request.changed.status The tab's update status; only concerned with 'complete'
 */
chrome.runtime.onMessage.addListener(
  function(request) {
    if (!request.exclude) {
      // This website is not excluded in options
      if (request.option) {
        pinnedOut.option = request.option;
      }
      if (request.changed.hasOwnProperty('pinned')) {
        // The tab was either pinned or unpinned
        if (request.changed.pinned) {
          // The tab is now pinned; it previously wasn't
          pinnedOut.manipulateAnchors(true);
        } else {
          // The tab was unpinned
          pinnedOut.manipulateAnchors(false);
        }
      } else if (request.changed.status === 'complete') {
        // The page load or content updates are complete
        if (request.pinnedState) {
          // The tab is pinned
          // Using tab.pinned because the update was not pin-related
          pinnedOut.manipulateAnchors(true);
        }
      }
    }
  });
