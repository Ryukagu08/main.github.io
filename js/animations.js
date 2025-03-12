/**
 * animations.js - Handles UI animations and transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial animations for first page load
  animateInitialContent();
  
  // Set up any animation-related event listeners
  setupAnimationTriggers();
});

/**
 * Animate content on initial page load
 */
function animateInitialContent() {
  // Find the active page
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
 * Set up triggers for animations
 */
function setupAnimationTriggers() {
  // Project cards animation (used when filter is applied)
  setupProjectFilters();
  
  // Skill tag hover effects
  setupSkillTagEffects();
}

/**
 * Set up project filter functionality and animations
 */
function setupProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filter = this.getAttribute('data-filter');
      
      // For future: Apply actual filtering logic
      console.log(`Filter selected: ${filter}`);
      
      // Re-animate the cards
      animateRepoCards();
    });
  });
}

/**
 * Animate repository cards with staggered effect
 */
function animateRepoCards() {
  const repoCards = document.querySelectorAll('.repo-card');
  
  // Remove existing animation classes
  repoCards.forEach(card => {
    card.classList.remove('animate-in');
  });
  
  // Re-apply animations with delay
  setTimeout(() => {
    repoCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-in');
    });
  }, 50);
}

/**
 * Set up skill tag hover animation effects
 */
function setupSkillTagEffects() {
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      // Add subtle animation or effect on hover
      // This is handled by CSS transitions, but could be enhanced here
    });
  });
}