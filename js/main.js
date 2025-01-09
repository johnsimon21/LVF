function handleToggleDropdown(selector) {
  const dropdown = document.querySelector(selector);
  
  if (dropdown) {
      dropdown.classList.toggle('is-active');
      console.log(`Toggled dropdown for: ${selector}`);
  } else {
      alert(`Dropdown with selector "${selector}" not found.`);
  }
}
function handleScreenChange() {
  const dropdown = document.querySelector('.dropdown');
  if (window.matchMedia('(min-width: 948px)').matches) {
    dropdown.classList.remove('is-active'); // Hide dropdown
    console.log('Dropdown hidden due to screen size.');
  }
}

// Add event listener for resize events
window.addEventListener('resize', handleScreenChange);

handleScreenChange();