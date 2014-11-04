// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

var manipulateAnchors = function() {
	var anchors = document.getElementsByTagName('a');
	for (var a = 0; a < anchors.length; a++) {
		anchors[a].setAttribute('target', '_blank');
	}
};

chrome.tabs.query({ pinned: true }, function(tabs) {
  for (var i = 0; i < tabs.length; i++) {
  	manipulateAnchors();
  }
});
