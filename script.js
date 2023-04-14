// Get the tab links and tab content sections
const tabLinks = document.querySelectorAll('nav ul li a');
const tabContentSections = document.querySelectorAll('main section');

// Check if this is the first time the page is loaded
const isFirstTime = localStorage.getItem('isFirstTime') === null;
if (isFirstTime) {
  // If this is the first time, set the "About" tab as active
  tabLinks[1].classList.add('active');
  tabContentSections[0].style.display = 'none';
  tabContentSections[1].style.display = 'block';
  // Set the flag to indicate that the page has been loaded before
  localStorage.setItem('isFirstTime', false);
} else {
  // If this is not the first time, hide all the tab content sections except the first one
  tabContentSections.forEach((section, index) => {
    if (index !== 0) {
      section.style.display = 'none';
    }
  });
}

// Loop through all the tab links and add click event listeners
tabLinks.forEach((link, index) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    // Remove the "active" class from all the tab links
    tabLinks.forEach((tabLink) => {
      tabLink.classList.remove('active');
    });

    // Add the "active" class to the clicked tab link
    link.classList.add('active');

    // Hide all the tab content sections
    tabContentSections.forEach((tabContent) => {
      tabContent.style.display = 'none';
    });

    // Show the content of the selected tab section
    const selectedTabContentId = link.getAttribute('href');
    const selectedTabContent = document.querySelector(selectedTabContentId);
    selectedTabContent.style.display = 'block';
  });

  // If this is not the first tab link, add a tooltip to prompt the user to click it
  if (index !== 0) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    //   tooltip.textContent = 'Click to learn more';
    link.appendChild(tooltip);
  }
});


// Get the height of the footer
//const footerHeight = document.querySelector('footer').offsetHeight;

// Set the padding-bottom value of the main container to match the height of the footer
//document.querySelector('.main-container').style.paddingBottom = footerHeight + 'px';
