/* Add smooth scrolling to internal links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/* Toggle the "responsive" class to the header when the user clicks on the menu button */
function toggleMenu() {
  var x = document.querySelector("nav");
  if (x.className === "") {
    x.className = "responsive";
  } else {
    x.className = "";
  }
}
