function handleToggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('is-active');
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