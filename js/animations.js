/**
 * animations.js - UI animations and effects
 */

document.addEventListener('DOMContentLoaded', () => {
  animateInitialContent();
  setupAnimationTriggers();
  setupCursorGlowEffect();
});

/**
 * Animate content on initial page load
 */
function animateInitialContent() {
  const activePage = document.querySelector('.page-content.active');
  if (!activePage) return;
  
  // Animate headings with staggered delay
  const headings = activePage.querySelectorAll('h2, h3');
  headings.forEach((el, index) => {
    el.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    el.classList.add('animate-slide-up');
  });
  
  // Animate paragraphs with staggered delay
  const paragraphs = activePage.querySelectorAll('p');
  paragraphs.forEach((el, index) => {
    el.style.animationDelay = `${0.4 + (index * 0.1)}s`;
    el.classList.add('animate-fade-in');
  });
  
  // Fade in the content container
  setTimeout(() => {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.classList.add('fade-in');
    }
  }, 100);
}

/**
 * Set up animation triggers
 */
function setupAnimationTriggers() {
  setupSkillTagEffects();
}

/**
 * Set up skill tag hover animations
 */
function setupSkillTagEffects() {
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      // Animation handled by CSS transitions
    });
  });
}

/**
 * Set up cursor glow effect for navigation links
 */
function setupCursorGlowEffect() {
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  
  navLinks.forEach(navLink => {
    // Create a glow element for each nav link
    const glowElement = document.createElement('div');
    glowElement.className = 'nav-glow';
    navLink.appendChild(glowElement);
    
    // Track mouse position within the navigation button
    navLink.addEventListener('mousemove', (e) => {
      const rect = navLink.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update glow position
      glowElement.style.left = `${x}px`;
      glowElement.style.top = `${y}px`;
      glowElement.classList.add('active');
    });
    
    // Remove glow when mouse leaves
    navLink.addEventListener('mouseleave', () => {
      glowElement.classList.remove('active');
    });
  });
}