// Get all the tab links
const tabLinks = document.querySelectorAll('nav ul li a');

// Get all the tab content
const tabContents = document.querySelectorAll('main section');

// Loop through each tab link and add a click event listener
tabLinks.forEach((tabLink, index) => {
  tabLink.addEventListener('click', (event) => {
    // Prevent the default link behavior
    event.preventDefault();

    // Hide all the tab content
    tabContents.forEach((tabContent) => {
      tabContent.style.display = 'none';
    });

    // Show the selected tab content
    const selectedTabContent = tabContents[index];
    selectedTabContent.style.display = 'block';
  });
});
