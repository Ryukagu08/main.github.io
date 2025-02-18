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

  // Fade-in effect for the right-hand content
  const content = document.querySelector('.content');
  if (content) {
    setTimeout(() => {
      content.classList.add('fade-in');
    }, 300); // Delay before fade-in starts (optional)
  }
});

// Github Emoji
function parseEmojis(text) {
  const emojiMap = {
    ':zap:': '⚡',
    ':smile:': '😄',
    ':rocket:': '🚀'
    // add more mappings as needed
  };
  return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}

// Github API
const username = 'Ryukagu08';

// If left empty (i.e., []), it will display all repos.
const desiredRepos = []; // Repo names

// Mapping of programming languages to colors.
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

// Helper function to get the language color or a default
function getLanguageColor(language) {
  return languageColors[language] || '#ccc';
}

fetch(`https://api.github.com/users/${username}/repos`)
  .then(response => response.json())
  .then(repos => {
    console.log("Fetched Repositories:", repos); // Debugging output

    if (!repos.length) {
      console.warn("No repositories found. Check API response.");
      return;
    }

    const repoContainer = document.getElementById('repo-container');
    if (!repoContainer) {
      console.error("Error: #repo-container not found in the DOM.");
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-card';

      const description = repo.description ? parseEmojis(repo.description) : "No description provided.";

      // Create languageHTML only if a language is provided.
      const languageHTML = repo.language ? `
        <p>
          <span class="language-dot" style="background-color: ${getLanguageColor(repo.language)};"></span>
          ${repo.language}
        </p>
      ` : '';

      card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${description}</p>
        ${languageHTML}
      `;

      repoContainer.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching repos:', error));
