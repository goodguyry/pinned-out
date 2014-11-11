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
  td.setAttribute('data-key', key)
  var tdRemove = document.createElement('td');
  tdRemove.innerText = htmlDecode("&times;");
  tdRemove.setAttribute('class', 'remove');
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

// Collect localStorage values and build the table on load
document.addEventListener('DOMContentLoaded', collectLocalStorageValues, false);

/**
 * Save the clicked radio button's value to localStorage
 */
document.getElementById('behavior').addEventListener('click',
  function(e) {
    if (e && e.target.nodeName === 'INPUT') {
      localStorage.setItem('behavior', e.target.value);
    }
  }, false
);
