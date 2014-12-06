var pinnedOut = {};

// Get checkbox
var pinnedOut.checkbox = document.getElementById('exclude');
// Get the output span in the label
var pinnedOut.domain = document.getElementById('domain');

/**
 * Extract the domain from a URL
 *
 * @param {String} text The value from the input
 */
pinnedOut.cleanInput = function(text) {
  var pattern = /(?:www\.)?([a-z0-9\-.]+)(?:\.[a-z\.]+)/i;
  return text.match(pattern)[0];
};

// Set the checkbox state to reflect whether or not the domain is excluded
chrome.tabs.query(
  { active: true, pinned: true, currentWindow: true },
  function(tab) {
    chrome.storage.sync.get(
      null,
      function(items) {
        for (var key in items) {
          if (tab[0].url.search(items[key]) > -1) {
            // the domain was found in the exclude list
            pinnedOut.checkbox.checked = true;
            pinnedOut.checkbox.setAttribute('data-key', key);
          }
        }
        // Set the label text
        var output = pinnedOut.cleanInput(tab[0].url);
        pinnedOut.domain.innerHTML = output;
      }
    );
  }
);

pinnedOut.handleCheckbox = function(e) {
  if (e.target.checked) {
    // Checkbox was selected
    // Get the current tab
    chrome.tabs.query(
      { active: true, pinned: true, currentWindow: true },
      function(tab) {
        var item = {};
        // Create the timestamp (key)
        var timeStamp = new Date().getTime();
        // Extract the domain from the URL
        var output = pinnedOut.cleanInput(tab[0].url);
        item[timeStamp] = output;
        // Save the domain
        chrome.storage.sync.set(item);
      }
    );
  } else {
    // Checkbox was deselected
    // Get the data-key value, which is the key for the storage item
    var key = e.target.dataset.key;
    // Remove the domain
    chrome.storage.sync.remove(key);
  }
};


/**
 * Listen for radio button clicks
 */
document.addEventListener(
  'click',
  function(e) {
    if (e && e.target.nodeName === 'INPUT') {
      pinnedOut.handleCheckbox(e);
    }
  },
  false
);
