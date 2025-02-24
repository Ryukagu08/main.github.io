// Theme Preference
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

// Modified theme toggle handler (replace the existing one at bottom of file)
document.getElementById('theme-toggle').addEventListener('click', function() {
  const themeStyle = document.getElementById('theme-style');
  const isDark = themeStyle.href.includes('dark');
  const newTheme = isDark ? 'light' : 'dark';
  const themeIcon = this.querySelector('i');

  // Update stylesheet
  themeStyle.href = `style-${newTheme}.css`;
  
  // Update icon
  if (newTheme === 'light') {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  } else {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
  
  // Save preference
  localStorage.setItem('theme', newTheme);
});

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.index ul li a.tab');
  const contentContainer = document.querySelector('.content');

  if (document.getElementById('repo-container')) {
    loadRepos();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');

      // Fade out the current content
      if (contentContainer) {
        contentContainer.classList.remove('fade-in');
        contentContainer.classList.add('fade-out');
      }

      // After the fade-out, load new content via AJAX
      setTimeout(() => {
        fetch(url)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newContent = doc.querySelector('.content');
            if (newContent && contentContainer) {
              const currentTheme = document.getElementById('theme-style').href;
              contentContainer.innerHTML = newContent.innerHTML;
              document.getElementById('theme-style').href = currentTheme;

              contentContainer.innerHTML = newContent.innerHTML;
              contentContainer.classList.remove('fade-out');
              contentContainer.classList.add('fade-in');

              // If the new content includes a repo container, load the repos
              if (document.getElementById('repo-container')) {
                loadRepos();
              }
            }
            // Update the browser's URL
            history.pushState(null, '', url);
          })
          .catch(err => {
            console.error('Error loading page:', err);
            // Fallback to a full navigation on error
            window.location.href = url;
          });
      }, 600); // Adjust this delay to match your fade-out duration

      if (document.getElementById('repo-container')) {
        loadRepos();
      }
    
      // Existing fade-in code...
      const content = document.querySelector('.content');
      if (content) {
        setTimeout(() => {
          content.classList.add('fade-in');
        }, 300);
      }
    });
  });

  // On initial page load, fade in the content
  const content = document.querySelector('.content');
  if (content) {
    setTimeout(() => {
      content.classList.add('fade-in');
    }, 300);
  }
});

// Function to load GitHub repositories into #repo-container
function loadRepos() {
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
      repoContainer.innerHTML = ''; // Clear any existing content
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
}

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
