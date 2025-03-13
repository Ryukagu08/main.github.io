/**
 * GitHub API integration for Projects page
 */

// Configuration
const CONFIG = {
  username: 'Ryukagu08',
  perPage: 100,
  cacheDuration: 30 * 60 * 1000, // 30 minutes
  excludedRepos: ['TaskManagerApp']
};

// Category definitions for filtering
const CATEGORIES = {
  web: ['html', 'webpage', 'website', 'web-', 'landing-page', 'frontend', 'css', 'page', 'site'],
  game: ['game', 'unity', 'unreal', 'godot', 'phaser', 'three.js', 'webgl'],
  tools: ['tool', 'utility', 'bot', 'automation', 'cli']
};

// Language color mapping
const LANGUAGE_COLORS = {
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'TypeScript': '#2b7489',
  'C#': '#178600',
  'C++': '#f34b7d',
  'PHP': '#4F5D95',
  'Go': '#00ADD8',
  'Ruby': '#701516',
  'Swift': '#ffac45',
  'Kotlin': '#F18E33',
  'Rust': '#dea584'
};

// Emoji mapping for GitHub emoji codes
const EMOJI_MAP = {
  ':zap:': '⚡', ':smile:': '😄', ':rocket:': '🚀', ':star:': '⭐', 
  ':fire:': '🔥', ':tada:': '🎉', ':heart:': '❤️', ':warning:': '⚠️',
  ':bug:': '🐛', ':books:': '📚', ':wrench:': '🔧', ':bulb:': '💡'
};

// Cache for GitHub API responses
const repoCache = {
  data: null,
  timestamp: 0,
  expiry: CONFIG.cacheDuration
};

/**
 * Main function to load repositories
 */
function loadRepos() {
  const repoContainer = document.getElementById('repo-container');
  
  if (!repoContainer) {
    console.error("Error: #repo-container not found in the DOM.");
    return;
  }
  
  // Try to use cached data first
  if (hasFreshCache()) {
    const filteredCache = filterExcludedRepos(repoCache.data);
    displayRepos(filteredCache, repoContainer);
    setupFilters(filteredCache);
    return;
  }
  
  showLoading(repoContainer);
  fetchRepositories()
    .then(repos => {
      if (!repos || !repos.length) {
        showEmptyState(repoContainer);
        return;
      }
      
      // Cache and display repositories
      repoCache.data = repos;
      repoCache.timestamp = Date.now();
      
      const filteredRepos = filterExcludedRepos(repos);
      if (!filteredRepos.length) {
        repoContainer.innerHTML = '<p>No repositories available for display.</p>';
        return;
      }
      
      displayRepos(filteredRepos, repoContainer);
      setupFilters(filteredRepos);
    })
    .catch(error => {
      console.error('Error fetching repos:', error);
      repoContainer.innerHTML = '<p>Error loading projects. Please refresh the page to try again.</p>';
    });
}

/**
 * Check if we have fresh cached data
 */
function hasFreshCache() {
  return repoCache.data && 
         (Date.now() - repoCache.timestamp < repoCache.expiry);
}

/**
 * Filter out excluded repositories
 */
function filterExcludedRepos(repos) {
  return repos.filter(repo => !CONFIG.excludedRepos.includes(repo.name));
}

/**
 * Display loading indicator
 */
function showLoading(container) {
  container.innerHTML = '<div class="loading-indicator"><i class="fas fa-circle-notch fa-spin"></i> Loading projects...</div>';
}

/**
 * Show empty state message
 */
function showEmptyState(container) {
  container.innerHTML = '<p>No repositories found. Check back soon for new projects!</p>';
}

/**
 * Fetch repositories from GitHub API
 */
async function fetchRepositories() {
  const response = await fetch(
    `https://api.github.com/users/${CONFIG.username}/repos?sort=updated&direction=desc&per_page=${CONFIG.perPage}`
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }
  
  return response.json();
}

/**
 * Display repositories with optional filtering
 */
function displayRepos(repos, container, filter = 'all') {
  // Clear container
  container.innerHTML = '';
  
  // Apply filtering
  const filteredRepos = filterReposByCategory(repos, filter);
  
  // Show message if no repos match the filter
  if (filteredRepos.length === 0) {
    container.innerHTML = `<p>No projects found in the "${filter}" category.</p>`;
    return;
  }
  
  // Create repository cards
  filteredRepos.forEach((repo, index) => {
    createRepoCard(repo, index, container);
  });
  
  // Animate cards
  animateRepoCards();
}

/**
 * Filter repositories by category
 */
function filterReposByCategory(repos, filter) {
  if (filter === 'all') {
    return repos;
  }
  
  return repos.filter(repo => {
    const name = repo.name.toLowerCase();
    const desc = repo.description ? repo.description.toLowerCase() : '';
    const lang = repo.language ? repo.language.toLowerCase() : '';
    
    if (filter === 'web') {
      // Special case for web category
      if (repo.language === 'HTML') return true;
      
      // Check for web indicators in name or description
      return CATEGORIES.web.some(keyword => 
        name.includes(keyword) || desc.includes(keyword)
      );
    }
    
    // For other categories, check against category keywords
    return CATEGORIES[filter].some(keyword => 
      name.includes(keyword) || desc.includes(keyword) || lang === keyword
    );
  });
}

/**
 * Create a repository card
 */
function createRepoCard(repo, index, container) {
  const card = document.createElement('div');
  card.className = 'repo-card';
  card.style.animationDelay = `${index * 0.1}s`;
  card.classList.add('animate-in');
  
  const description = repo.description 
    ? parseEmojis(repo.description) 
    : "No description provided.";
    
  // Detect project type for tagging
  const projectType = getProjectType(repo);
  const projectTypeHTML = projectType 
    ? `<span class="project-type">${projectType}</span>` 
    : '';

  // Create language indicator if available
  const languageHTML = repo.language 
    ? `
      <div class="repo-meta">
        <span class="repo-language">
          <span class="language-dot" style="background-color: ${getLanguageColor(repo.language)};"></span>
          ${repo.language}
        </span>
      </div>
    ` 
    : '';
  
  card.innerHTML = `
    ${projectTypeHTML}
    <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
    <p>${description}</p>
    ${languageHTML}
  `;
  
  container.appendChild(card);
}

/**
 * Determine project type based on repo metadata
 */
function getProjectType(repo) {
  const name = repo.name.toLowerCase();
  const desc = repo.description ? repo.description.toLowerCase() : '';
  
  // Check for web development
  if (repo.language === 'HTML' || CATEGORIES.web.some(keyword => 
      name.includes(keyword) || desc.includes(keyword))) {
    return 'Web Development';
  }
  
  // Check for game development
  if (CATEGORIES.game.some(keyword => name.includes(keyword) || desc.includes(keyword))) {
    return 'Game Development';
  }
  
  // Check for tools
  if (CATEGORIES.tools.some(keyword => name.includes(keyword) || desc.includes(keyword))) {
    return 'Tool / Utility';
  }
  
  return null;
}

/**
 * Get color for programming language
 */
function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || '#ccc';
}

/**
 * Parse GitHub emoji codes into Unicode emojis
 */
function parseEmojis(text) {
  return text.replace(/:\w+:/g, match => EMOJI_MAP[match] || match);
}

/**
 * Set up filter buttons
 */
function setupFilters(repos) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter
      const filter = this.getAttribute('data-filter');
      const repoContainer = document.getElementById('repo-container');
      
      if (repoContainer) {
        displayRepos(repos, repoContainer, filter);
      }
    });
  });
}

/**
 * Animate repository cards
 */
function animateRepoCards() {
  const repoCards = document.querySelectorAll('.repo-card');
  
  // Remove existing animations
  repoCards.forEach(card => card.classList.remove('animate-in'));
  
  // Re-apply animations with delay
  setTimeout(() => {
    repoCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-in');
    });
  }, 50);
}

// Export loadRepos function globally
window.loadRepos = loadRepos;