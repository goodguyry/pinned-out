/**
 * Retrieve the stored value
 * Restore the saved state by matching the stored value to the radio button's value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
chrome.storage.sync.get('behavior', function(items) {
  var radios = document.getElementsByName('behavior');
  if (items.behavior === radios[1].value) {
    radios[1].checked = true;
  } else {
    radios[0].checked = true;
    // In case nothing is in storage
    chrome.storage.sync.set({'behavior': 'default'});
  }
});

/**
 * Decode HTML entities
 * Used to present to &times; sign
 *
 * http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
 */
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}

/**
 * Add a table row for each excluded domain
 *
 * @param {String} text The text to be displayed in the td element
 * @param {String} key The property name, used for removal
 */
var addTableRow = function(text, key) {
  var tbody = document.getElementById('excludes');
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.innerText = text;
  var tdRemove = document.createElement('td');
  tdRemove.innerText = htmlDecode("&times;");
  tdRemove.setAttribute('class', 'remove');
  tdRemove.setAttribute('data-key', key);
  tdRemove.setAttribute('tabindex', 0);
  tr.appendChild(td);
  tr.appendChild(tdRemove);
  tbody.appendChild(tr);
};

/**
 * Collect storage values and pass to addTableRow
 * 'behavior' is ignored for obvious reasons
 */
var collectStorageValues = function() {
  chrome.storage.sync.get(null, function(items) {
    for (var site in items) {
      if (site !== 'behavior') {
        addTableRow(items[site], site);
      }
    }
  });
};

/**
 * Clean user input
 * Extract the domain from the input value
 */
var cleanInput = function(text) {
  var pattern = /(?:www\.)?([a-z0-9\-.]+)(?:\.[a-z\.]+)/i;
  return text.match(pattern)[0];
};

var saveNewExcludedSite = function(e) {
  if (e.target.value !== '') {
    var item = {};
    var timeStamp = new Date().getTime();
    item[timeStamp] = e.target.value;
    chrome.storage.sync.set(item);
    var output = cleanInput(e.target.value);
    addTableRow(output, timeStamp);
    e.target.value = '';
  }
};

var removeExcludedSite = function(e) {
  var key = e.target.dataset.key;
  chrome.storage.sync.remove(key);
  e.target.parentElement.remove();
};

// Collect storage values and build the table on load
document.addEventListener('DOMContentLoaded', collectStorageValues, false);

/**
 * Save the clicked radio button's value to storage
 */
document.getElementById('behavior').addEventListener('click',
  function(e) {
    if (e && e.target.type === 'radio') {
      chrome.storage.sync.set({'behavior': e.target.value});
    }
  }, false
);

/**
 * Add the new site when the return key is pressed while the input has focus
 * Ignored if the input is empty
 */
document.getElementById('add').addEventListener('keydown',
  function(e) {
    if (e && e.keyCode === 13) {
      e.preventDefault();
      saveNewExcludedSite(e);
    }
  }, false);

/**
 * Remove the site when the × is clicked
 */
document.getElementById('excludes').addEventListener('click',
  function(e){
    if (e && e.target.classList[0] === 'remove') {
      removeExcludedSite(e);
    }
  }, false);

/**
 * Remove the site if the spacebar is pressed when the × has focus
 */
document.getElementById('excludes').addEventListener('keydown',
  function(e) {
    if (e && e.keyCode === 32 && e.target.classList[0] === 'remove') {
      removeExcludedSite(e);
    }
  }, false);
