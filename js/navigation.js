/**
 * navigation.js - Handles page navigation and content switching
 */

// Initialize page navigation
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  handleInitialPage();
});

/**
 * Set up navigation event listeners
 */
function initNavigation() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-link, .logo-link, .primary-button[data-page]');
  
  // Add click event listeners
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavigation);
  });
  
  // Set up browser history handling
  window.addEventListener('popstate', handlePopState);
}

/**
 * Handle navigation link clicks
 * @param {Event} e - Click event
 */
function handleNavigation(e) {
  e.preventDefault();
  const targetPage = e.currentTarget.getAttribute('data-page');
  navigateToPage(targetPage);
}

/**
 * Navigate to the specified page
 * @param {string} pageName - The ID of the page to navigate to
 */
function navigateToPage(pageName) {
  // Don't navigate if already on the page
  if (isCurrentPage(pageName)) return;
  
  // Show transition overlay
  const overlay = document.getElementById('transition-overlay');
  overlay.style.width = '100%';
  
  // Update browser history
  const newUrl = `#${pageName}`;
  history.pushState({ page: pageName }, '', newUrl);
  
  // Wait for transition effect
  setTimeout(() => {
    // Hide all pages
    hideAllPages();
    
    // Show the target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Load any page-specific content
    loadPageContent(pageName);
    
    // Apply animations to the page content
    animatePageContent(targetPage);
    
    // Hide the overlay
    setTimeout(() => {
      overlay.style.width = '0';
    }, 300);
  }, 300);
}

/**
 * Check if the given page is currently active
 * @param {string} pageName - The page ID to check
 * @returns {boolean} True if it's the current page
 */
function isCurrentPage(pageName) {
  const currentPage = document.querySelector('.page-content.active');
  return currentPage && currentPage.id === pageName;
}

/**
 * Hide all page content sections
 */
function hideAllPages() {
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => {
    page.classList.remove('active');
  });
}

/**
 * Handle the browser's back/forward buttons
 * @param {Event} e - PopState event
 */
function handlePopState(e) {
  const pageName = e.state ? e.state.page : 'home';
  navigateToPage(pageName);
}

/**
 * Handle the initial page load based on URL hash
 */
function handleInitialPage() {
  // Get page from URL hash or default to 'home'
  let initialPage = 'home';
  const hash = window.location.hash;
  
  if (hash) {
    // Remove the # symbol
    const pageId = hash.substring(1);
    
    // Check if page exists
    const pageElement = document.getElementById(pageId);
    if (pageElement && pageElement.classList.contains('page-content')) {
      initialPage = pageId;
    }
  }
  
  // Set initial history state
  history.replaceState({ page: initialPage }, '', `#${initialPage}`);
  
  // Navigate to initial page without animation
  hideAllPages();
  const targetPage = document.getElementById(initialPage);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Load any page-specific content
  loadPageContent(initialPage);
}

/**
 * Load page-specific content (e.g., GitHub repos for projects page)
 * @param {string} pageName - The page ID to load content for
 */
function loadPageContent(pageName) {
  // Projects page - load GitHub repositories
  if (pageName === 'projects' && window.loadRepos) {
    window.loadRepos();
  }
}

/**
 * Apply animations to page content
 * @param {HTMLElement} pageElement - The page element to animate
 */
function animatePageContent(pageElement) {
  if (!pageElement) return;
  
  // Add animation classes to headings
  const headings = pageElement.querySelectorAll('h2, h3');
  headings.forEach((el, index) => {
    el.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    el.classList.add('animate-slide-up');
  });
  
  // Add animation classes to paragraphs
  const paragraphs = pageElement.querySelectorAll('p');
  paragraphs.forEach((el, index) => {
    el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    el.classList.add('animate-fade-in');
  });
}