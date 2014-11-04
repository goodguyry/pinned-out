// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });






/*
 * Receive the search text from popup.js
 * See http://developer.chrome.com/extensions/messaging.html
 */
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {

    var pinnedState = null;

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {

      pinnedState = tabs[0].pinned;

      // Sent from popup.js
      if (request.scriptMessage === 'ready') {
        console.log('inject.js', request.scriptMessage);
        // Get the current tab's index and send the search text along to the search handler
      }

    });

    window.setTimeout(function() {
      console.log('pinnedState', pinnedState);

      if (request.scriptMessage !== '') {
        sendResponse({scriptResponse: pinnedState});
      }

    }, 100);

  });



/*
 * Receive the search text from popup.js
 * See http://developer.chrome.com/extensions/messaging.html
 */
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {

//     var respondToInject = {
//       scriptResponse: 'Do work...'
//     };

//     // Sent from popup.js
//     if (request.scriptMessage === 'ready') {
//       console.log('inject.js', request.scriptMessage);
//       // Get the current tab's index and send the search text along to the search handler
//       chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
//         // for (var i = 0; i < tabs.length; i++) {
//         // respondToInject.scriptResponse = tabs[0].pinned;
//         console.log('pinnedState', tabs[0].pinned);
//         sendResponse({scriptResponse: tabs[0].pinned});
//         // }
//       });
//       // chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//       //   // Do something here
//       //   // this tab is tabs[0].index
//       // });
//       // if (request.scriptMessage !== '') {
//       // }
//     }

//   });










//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });



