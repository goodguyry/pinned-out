/**
 * Retrieve the stored value
 * Restore the saved state by matching the stored value to the radio button's value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
var storedBehavior = localStorage.getItem('behavior');
var radios = document.getElementsByName('behavior');
if (storedBehavior === radios[1].value) {
  radios[1].checked = true;
} else {
  radios[0].checked = true;
  // In case nothing is in localStorage
  localStorage.setItem('behavior', 'default');
}

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
  tdRemove.setAttribute('data-key', key)
  tdRemove.setAttribute('tabindex', 0);
  tr.appendChild(td);
  tr.appendChild(tdRemove);
  tbody.appendChild(tr);
};

/**
 * Collect localStorage values and pass to addTableRow
 * 'behavior' is ignored for obvious reasons
 */
var collectLocalStorageValues = function() {
  var storage = localStorage;
  for (var site in localStorage) {
    if (site !== 'behavior') {
      addTableRow(localStorage[site], site);
    }
  }
};

var saveNewExcludedSite = function(e) {
  if (e.target.value !== '') {
    var timeStamp = new Date().getTime();
    var property = 'exclude' + timeStamp;
    localStorage.setItem(property, e.target.value);
    addTableRow(e.target.value, property)
    e.target.value = '';
  }
};

var removeExcludedSite = function(e) {
  var key = e.target.dataset.key;
  localStorage.removeItem(key);
  e.target.parentElement.remove();
};

// Collect localStorage values and build the table on load
document.addEventListener('DOMContentLoaded', collectLocalStorageValues, false);

/**
 * Save the clicked radio button's value to localStorage
 */
document.getElementById('behavior').addEventListener('click',
  function(e) {
    if (e && e.target.type === 'radio') {
      localStorage.setItem('behavior', e.target.value);
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
