/**
 * theme-manager.js - Handles theme switching and persistence
 */

// Apply saved theme preference on load
document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  setupThemeToggle();
});

/**
 * Apply the saved theme from localStorage or default to dark
 */
function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const themeStyle = document.getElementById('theme-style');
  const desktopToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  
  // Apply saved theme
  themeStyle.href = `css/${savedTheme}-theme.css`;

  // Set correct icons
  updateThemeIcon(desktopToggle, savedTheme);
  updateThemeIcon(mobileToggle, savedTheme);
}

/**
 * Update theme icon based on current theme
 */
function updateThemeIcon(button, theme) {
  if (!button) return;
  
  const icon = button.querySelector('i');
  if (!icon) return;
  
  if (theme === 'light') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
}

/**
 * Set up the theme toggle buttons
 */
function setupThemeToggle() {
  const desktopToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  
  if (desktopToggle) {
    desktopToggle.addEventListener('click', toggleTheme);
  }
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const themeStyle = document.getElementById('theme-style');
  const isDark = themeStyle.href.includes('dark');
  const newTheme = isDark ? 'light' : 'dark';
  const desktopToggle = document.getElementById('theme-toggle');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  
  // Add transition overlay - slides from left to right
  const overlay = document.getElementById('transition-overlay');
  overlay.style.width = '100%';
  
  // Update stylesheet and icons after a slight delay
  setTimeout(() => {
    // Update stylesheet
    themeStyle.href = `css/${newTheme}-theme.css`;
    
    // Update both toggle icons with animation
    animateThemeIcon(desktopToggle, newTheme);
    animateThemeIcon(mobileToggle, newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Hide overlay
    setTimeout(() => {
      overlay.style.width = '0';
    }, 300);
  }, 300);
}

/**
 * Animate theme icon change
 */
function animateThemeIcon(button, theme) {
  if (!button) return;
  
  const icon = button.querySelector('i');
  if (!icon) return;
  
  icon.style.transform = 'rotate(180deg)';
  
  setTimeout(() => {
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
    icon.style.transform = 'rotate(0deg)';
  }, 300);
}