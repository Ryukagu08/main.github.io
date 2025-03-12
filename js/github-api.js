/**
 * github-api.js - Handles GitHub API integration for projects page
 */

// Language color mapping for repository cards
const languageColors = {
  'JavaScript': '#f1e05a',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Ruby': '#701516',
  'C++': '#f34b7d',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'TypeScript': '#2b7489',
  'PHP': '#4F5D95',
  'C#': '#178600',
  'Go': '#00ADD8',
  'Swift': '#ffac45',
  'Kotlin': '#F18E33',
  'Rust': '#dea584'
};

// GitHub emoji mapping for repo descriptions
const emojiMap = {
  ':zap:': '⚡',
  ':smile:': '😄',
  ':rocket:': '🚀',
  ':star:': '⭐',
  ':fire:': '🔥',
  ':tada:': '🎉',
  ':heart:': '❤️',
  ':warning:': '⚠️',
  ':bug:': '🐛',
  ':books:': '📚',
  ':wrench:': '🔧',
  ':bulb:': '💡'
};

/**
 * Load GitHub repositories into the projects container
 */
function loadRepos() {
  const username = 'Ryukagu08';
  const repoContainer = document.getElementById('repo-container');
  
  // Exit if no container found
  if (!repoContainer) {
    console.error("Error: #repo-container not found in the DOM.");
    return;
  }
  
  // Show loading indicator
  repoContainer.innerHTML = '<div class="loading-indicator"><i class="fas fa-circle-notch fa-spin"></i> Loading projects...</div>';

  // Fetch repositories from GitHub API
  fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }
      return response.json();
    })
    .then(repos => {
      // Handle empty response
      if (!repos.length) {
        repoContainer.innerHTML = '<p>No repositories found. Check back soon for new projects!</p>';
        return;
      }
      
      // Clear loading indicator
      repoContainer.innerHTML = '';
      
      // Create repository cards
      repos.forEach((repo, index) => {
        createRepoCard(repo, index, repoContainer);
      });
    })
    .catch(error => {
      console.error('Error fetching repos:', error);
      repoContainer.innerHTML = '<p>Error loading projects. Please refresh the page to try again.</p>';
    });
}

/**
 * Create a card for a GitHub repository
 * @param {Object} repo - Repository data from GitHub API
 * @param {number} index - Index for animation delay
 * @param {HTMLElement} container - Container element for the card
 */
function createRepoCard(repo, index, container) {
  // Create card element
  const card = document.createElement('div');
  card.className = 'repo-card card';
  card.style.animationDelay = `${index * 0.1}s`;
  card.classList.add('animate-in');
  
  // Process description with emoji parsing
  const description = repo.description 
    ? parseEmojis(repo.description) 
    : "No description provided.";

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
  
  // Set card content
  card.innerHTML = `
    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
    <p>${description}</p>
    ${languageHTML}
  `;
  
  // Add to container
  container.appendChild(card);
}

/**
 * Get color for programming language or default color
 * @param {string} language - Programming language name
 * @returns {string} Color hex code
 */
function getLanguageColor(language) {
  return languageColors[language] || '#ccc';
}

/**
 * Parse GitHub emoji codes into Unicode emojis
 * @param {string} text - Text with GitHub emoji codes
 * @returns {string} Text with Unicode emojis
 */
function parseEmojis(text) {
  return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}

// Make loadRepos available globally
window.loadRepos = loadRepos;