// script.js changes
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.index ul li a.tab');
  const overlay = document.getElementById('transition-overlay');
  const sidebarWidth = 250;

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      
      // Get button position
      const rect = this.getBoundingClientRect();
      const buttonLeft = rect.left - sidebarWidth;
      const buttonWidth = rect.width;
      
      // Set overlay initial position and size
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${buttonWidth}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.top = `${rect.top}px`;
      
      // Add slide-out class to button
      this.classList.add('slide-out');
      
      // Animate overlay
      requestAnimationFrame(() => {
        overlay.style.left = `${sidebarWidth}px`;
        overlay.style.width = `calc(100% - ${sidebarWidth}px)`;
        overlay.style.top = '0';
        overlay.style.height = '100%';
      });

      // Navigate after animation
      setTimeout(() => {
        // Reset overlay and button
        overlay.removeAttribute('style');
        this.classList.remove('slide-out');
        window.location.href = target;
      }, 600);
    });
  });
});