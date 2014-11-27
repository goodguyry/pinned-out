// Get checkbox
var checkbox = document.getElementById('exclude');

// Set the checkbox state to reflect whether or not the domain is excluded
chrome.tabs.query(
  { active: true, pinned: true, currentWindow: true },
  function(tab) {
    chrome.storage.sync.get(
      null,
      function(items) {
        for (var key in items) {
          if (tab[0].url.search(items[key]) > -1) {
            checkbox.checked = true;
          }
        }
      }
    );
  }
);
