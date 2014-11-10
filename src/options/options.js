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
 * Save the clicked radio button's value to localStorage
 */
document.getElementById('behavior').addEventListener('click',
  function(e) {
    if (e && e.target.nodeName === 'INPUT') {
      localStorage.setItem('behavior', e.target.value);
    }
  }, false
);
