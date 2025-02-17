document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.index ul li a.tab');
  const overlay = document.getElementById('transition-overlay');
  const sidebar = document.querySelector('.sidebar');
  const sidebarWidth = 250;

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');

      // Get button position
      const rect = this.getBoundingClientRect();
      const buttonWidth = rect.width;

      // Set overlay initial position and size
      overlay.style.left = `${sidebarWidth}px`; // Start from the left edge of the sidebar
      overlay.style.width = `${buttonWidth}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.top = `${rect.top + window.scrollY}px`;

      // Add animations
      this.classList.add('slide-out');

      // Animate overlay to cover the viewport from the sidebar edge
      requestAnimationFrame(() => {
        overlay.style.left = `300px`;
        overlay.style.width = `calc(100% - 320px)`;
        overlay.style.top = '0';
        overlay.style.height = '100%';
      });

      // Navigate after animation
      setTimeout(() => {
        // Reset elements
        overlay.removeAttribute('style');
        this.classList.remove('slide-out');
        window.location.href = target;
      }, 600);
    });
  });
});
z