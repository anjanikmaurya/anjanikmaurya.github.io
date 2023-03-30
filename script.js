// Define the tab links and tab content sections
const tabLinks = document.querySelectorAll('.nav__item-link');
let tabContentSections;

// Wait for the page to load before showing the first tab content section
window.addEventListener('load', () => {
  tabContentSections = document.querySelectorAll('.tab__content');

  // Show only the first tab content section
  tabContentSections.forEach((section, index) => {
    if (index === 0) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
});

// Add click event listeners to the tab links
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
      tabContent.classList.add('hidden');
    });

    // Show the content of the selected tab section
    const selectedTabContentId = link.getAttribute('href');
    const selectedTabContent = document.querySelector(selectedTabContentId);
    selectedTabContent.classList.remove('hidden');
  });

  // If this is not the first tab link, add a tooltip to prompt the user to click it
  /*
  if (index !== 0) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = 'Click to learn more';
    link.appendChild(tooltip);
  }
  */
});
