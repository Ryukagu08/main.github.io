/**
 * theme-manager.js - Handles theme switching and persistence
 */

// Apply saved theme preference on load
(function initTheme() {
  applySavedTheme();
  setupThemeToggle();
})();

/**
 * Apply the saved theme from localStorage or default to dark
 */
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const themeStyle = document.getElementById('theme-style');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Apply saved theme
  themeStyle.href = `css/${savedTheme}-theme.css`;

  // Set correct icon
  if (savedTheme === 'light') {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  } else {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
}

/**
 * Set up the theme toggle button
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const themeStyle = document.getElementById('theme-style');
  const isDark = themeStyle.href.includes('dark');
  const newTheme = isDark ? 'light' : 'dark';
  const themeIcon = this.querySelector('i');
  
  // Add transition overlay
  const overlay = document.getElementById('transition-overlay');
  overlay.style.width = '100%';
  
  // Update stylesheet and icon after a slight delay
  setTimeout(() => {
    // Update stylesheet
    themeStyle.href = `css/${newTheme}-theme.css`;
    
    // Update icon with rotation animation
    themeIcon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      themeIcon.classList.replace(isDark ? 'fa-sun' : 'fa-moon', isDark ? 'fa-moon' : 'fa-sun');
      themeIcon.style.transform = 'rotate(0deg)';
    }, 300);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Hide overlay
    setTimeout(() => {
      overlay.style.width = '0';
    }, 300);
  }, 300);
}