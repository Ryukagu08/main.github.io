document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.index ul li a.tab');
  const contentContainer = document.querySelector('.content');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');

      // Fade out the current content
      if (contentContainer) {
        contentContainer.classList.remove('fade-in');
        contentContainer.classList.add('fade-out');
      }

      // After the fade-out (adjust duration as needed), load new content via AJAX
      setTimeout(() => {
        fetch(url)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newContent = doc.querySelector('.content');
            if (newContent && contentContainer) {
              contentContainer.innerHTML = newContent.innerHTML;
              // Fade the new content in
              contentContainer.classList.remove('fade-out');
              contentContainer.classList.add('fade-in');
            }
            // Update browser URL without reloading the sidebar
            history.pushState(null, '', url);
          })
          .catch(err => {
            console.error('Error loading page:', err);
            // Fallback to full navigation in case of error
            window.location.href = url;
          });
      }, 600); // This delay should match your fade-out transition duration
    });
  });

  // On page load, ensure content is visible
  const content = document.querySelector('.content');
  if (content) {
    setTimeout(() => {
      content.classList.add('fade-in');
    }, 300);
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
