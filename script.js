// Apply saved theme preference on load
(function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const themeStyle = document.getElementById('theme-style');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  // Apply saved theme
  themeStyle.href = `style-${savedTheme}.css`;

  // Set correct icon
  if (savedTheme === 'light') {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  } else {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
})();

// Theme toggle handler
document.getElementById('theme-toggle').addEventListener('click', function() {
  const themeStyle = document.getElementById('theme-style');
  const isDark = themeStyle.href.includes('dark');
  const newTheme = isDark ? 'light' : 'dark';
  const themeIcon = this.querySelector('i');

  // Update stylesheet
  themeStyle.href = `style-${newTheme}.css`;

  // Update icon
  themeIcon.classList.replace(isDark ? 'fa-sun' : 'fa-moon', isDark ? 'fa-moon' : 'fa-sun');

  // Save preference
  localStorage.setItem('theme', newTheme);
});

// Reusable AJAX navigation function
function ajaxNavigate(url) {
  const contentContainer = document.querySelector('.content');
  if (contentContainer) {
    contentContainer.classList.remove('fade-in');
    contentContainer.classList.add('fade-out');
  }
  setTimeout(() => {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newContent = doc.querySelector('.content');
        if (newContent && contentContainer) {
          // Preserve current theme stylesheet
          const currentTheme = document.getElementById('theme-style').href;
          contentContainer.innerHTML = newContent.innerHTML;
          document.getElementById('theme-style').href = currentTheme;
          contentContainer.classList.remove('fade-out');
          contentContainer.classList.add('fade-in');

          // Reapply any dynamic behavior (e.g., logo hover) if needed
          setupLogoHover();

          // Load repos if the new content has a repo container
          if (document.getElementById('repo-container')) {
            loadRepos();
          }
        }
        history.pushState(null, '', url);
      })
      .catch(err => {
        console.error('Error loading page:', err);
        window.location.href = url;
      });
  }, 600); // Delay matching fade-out duration
}

// Attach AJAX navigation to both nav links and the logo link
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.index ul li a.tab, .logo-link');
  const content = document.querySelector('.content');

  // Initial fade-in for main content on load
  if (content) {
    setTimeout(() => content.classList.add('fade-in'), 300);
  }

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      ajaxNavigate(url);
    });
  });

  // If on a page with repos, load them
  if (document.getElementById('repo-container')) {
    loadRepos();
  }
});

// Function to load GitHub repositories into #repo-container
function loadRepos() {
  const username = 'Ryukagu08';
  const desiredRepos = []; // Leave empty for all repos
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

  function getLanguageColor(language) {
    return languageColors[language] || '#ccc';
  }

  fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
    .then(response => response.json())
    .then(repos => {
      console.log("Fetched Repositories:", repos);
      if (!repos.length) {
        console.warn("No repositories found. Check API response.");
        return;
      }
      const repoContainer = document.getElementById('repo-container');
      if (!repoContainer) {
        console.error("Error: #repo-container not found in the DOM.");
        return;
      }
      repoContainer.innerHTML = ''; // Clear previous repos
      repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        const description = repo.description ? parseEmojis(repo.description) : "No description provided.";
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
}

// Github Emoji parser
function parseEmojis(text) {
  const emojiMap = {
    ':zap:': '⚡',
    ':smile:': '😄',
    ':rocket:': '🚀'
  };
  return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}