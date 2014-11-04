var manipulateAnchors = function() {
  var anchors = document.getElementsByTagName('a');
  for (var a = 0; a < anchors.length; a++) {
    anchors[a].style.backgroundColor = 'green';
  }
};

chrome.extension.sendMessage({scriptMessage: 'ready'},
  function(response) {
    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        // ----------------------------------------------------------
        // This part of the script triggers when page is done loading
        if (response.scriptResponse !=='') {
          console.log('response', response.scriptResponse);
          // console.log('pinnedState', response.pinnedState);
          manipulateAnchors();
        }
        // ----------------------------------------------------------

      }
    }, 10);
  });
