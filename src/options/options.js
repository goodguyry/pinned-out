/**
 * Retrieve the stored value
 * Restore the saved state by matching the radio button's value to the stored value
 * If nothing is saved, or the saved state is somehow incompatible, 'default' is stored
 */
var storedBehavior = localStorage.getItem('behavior');
var radios = document.getElementsByName('behavior');
switch (storedBehavior) {
  case radios[1].value:
    radios[1].checked = true;
    break;
  case radios[2].value:
    radios[2].checked = true;
    break;
  default:
    radios[0].checked = true;
    localStorage.setItem('behavior', 'default');
    break;
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
