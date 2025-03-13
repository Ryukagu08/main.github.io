/**
 * mobile-menu.js - Mobile menu functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
});

/**
 * Set up mobile menu functionality
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  
  if (!mobileMenuToggle || !mainNav || !mobileOverlay) return;
  
  // Toggle menu on button click
  mobileMenuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Update aria attributes
    const isExpanded = mainNav.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    
    // Toggle menu icon
    const menuIcon = mobileMenuToggle.querySelector('i');
    if (menuIcon) {
      if (isExpanded) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
      } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    }
  });
  
  // Close menu when clicking overlay
  mobileOverlay.addEventListener('click', () => {
    mainNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Update aria attributes
    mobileMenuToggle.setAttribute('aria-expanded', false);
    
    // Restore menu icon
    const menuIcon = mobileMenuToggle.querySelector('i');
    if (menuIcon) {
      menuIcon.classList.remove('fa-times');
      menuIcon.classList.add('fa-bars');
    }
  });
  
  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Update aria attributes
      mobileMenuToggle.setAttribute('aria-expanded', false);
      
      // Restore menu icon
      const menuIcon = mobileMenuToggle.querySelector('i');
      if (menuIcon) {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  });
  
  // Set initial ARIA attributes
  mobileMenuToggle.setAttribute('aria-controls', 'main-nav');
  mobileMenuToggle.setAttribute('aria-expanded', false);
  mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
}