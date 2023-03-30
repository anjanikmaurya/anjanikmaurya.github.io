// Get all the tab links and tab content sections
const tabLinks = document.querySelectorAll('nav ul li a');
const tabContentSections = document.querySelectorAll('main section');

// Loop through all the tab links and add click event listeners
tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove the "active" class from all the tab links
    tabLinks.forEach(tabLink => {
      tabLink.classList.remove('active');
    });

    // Add the "active" class to the clicked tab link
    link.classList.add('active');

    // Hide all the tab content sections
    tabContentSections.forEach(tabContent => {
      tabContent.style.display = 'none';
    });

    // Show the content of the selected tab section
    const selectedTabContentId = link.getAttribute('href');
    const selectedTabContent = document.querySelector(selectedTabContentId);
    selectedTabContent.style.display = 'block';
  });
});
