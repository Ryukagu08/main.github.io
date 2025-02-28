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

// Theme toggle handler with improved animation
document.getElementById('theme-toggle').addEventListener('click', function() {
  const themeStyle = document.getElementById('theme-style');
  const isDark = themeStyle.href.includes('dark');
  const newTheme = isDark ? 'light' : 'dark';
  const themeIcon = this.querySelector('i');
  
  // Add transition overlay
  const overlay = document.getElementById('transition-overlay');
  overlay.style.width = '100%';
  
  // Update stylesheet and icon after a slight delay
  setTimeout(() => {
    // Update stylesheet
    themeStyle.href = `style-${newTheme}.css`;
    
    // Update icon with rotation animation
    themeIcon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      themeIcon.classList.replace(isDark ? 'fa-sun' : 'fa-moon', isDark ? 'fa-moon' : 'fa-sun');
      themeIcon.style.transform = 'rotate(0deg)';
    }, 300);
    
    // Hide overlay
    setTimeout(() => {
      overlay.style.width = '0';
    }, 300);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
  }, 300);
});

// Improved AJAX navigation function with smoother transitions
function ajaxNavigate(url) {
  const contentContainer = document.querySelector('.content');
  if (contentContainer) {
    contentContainer.classList.remove('fade-in');
    contentContainer.classList.add('fade-out');
  }
  
  // Add transition overlay for smoother page transitions
  const overlay = document.getElementById('transition-overlay');
  overlay.style.width = '100%';
  
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
          
          // Add animation classes to main elements
          const headings = contentContainer.querySelectorAll('h2, h3');
          headings.forEach((el, index) => {
            el.style.animationDelay = `${0.1 + (index * 0.1)}s`;
            el.classList.add('animate-slide-up');
          });
          
          const paragraphs = contentContainer.querySelectorAll('p');
          paragraphs.forEach((el, index) => {
            el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
            el.classList.add('animate-fade-in');
          });
          
          contentContainer.classList.add('fade-in');

          // Load repos if the new content has a repo container
          if (document.getElementById('repo-container')) {
            loadRepos();
          }
          
          // Hide overlay after content is loaded
          setTimeout(() => {
            overlay.style.width = '0';
          }, 300);
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
    // Add animation classes to main elements on page load
    const headings = content.querySelectorAll('h2, h3');
    headings.forEach((el, index) => {
      el.style.animationDelay = `${0.3 + (index * 0.1)}s`;
      el.classList.add('animate-slide-up');
    });
    
    const paragraphs = content.querySelectorAll('p');
    paragraphs.forEach((el, index) => {
      el.style.animationDelay = `${0.4 + (index * 0.1)}s`;
      el.classList.add('animate-fade-in');
    });
    
    setTimeout(() => content.classList.add('fade-in'), 100);
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

// Enhanced function to load GitHub repositories into #repo-container
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
  
  // Loading indicator
  const repoContainer = document.getElementById('repo-container');
  if (repoContainer) {
    repoContainer.innerHTML = '<div class="loading-indicator"><i class="fas fa-circle-notch fa-spin"></i> Loading projects...</div>';
  } else {
    console.error("Error: #repo-container not found in the DOM.");
    return;
  }

  fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
    .then(response => response.json())
    .then(repos => {
      console.log("Fetched Repositories:", repos);
      if (!repos.length) {
        repoContainer.innerHTML = '<p>No repositories found. Check back soon for new projects!</p>';
        return;
      }
      
      repoContainer.innerHTML = ''; // Clear loading indicator
      
      repos.forEach((repo, index) => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
        
        const description = repo.description ? parseEmojis(repo.description) : "No description provided.";
  
        
        const languageHTML = repo.language ? `
          <div class="repo-meta">
            <span class="repo-language">
              <span class="language-dot" style="background-color: ${getLanguageColor(repo.language)};"></span>
              ${repo.language}
            </span>
          </div>
        ` : '';
        
        card.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${description}</p>
          ${languageHTML}
        `;
        repoContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching repos:', error);
      repoContainer.innerHTML = '<p>Error loading projects. Please refresh the page to try again.</p>';
    });
}

// Github Emoji parser
function parseEmojis(text) {
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
  return text.replace(/:\w+:/g, match => emojiMap[match] || match);
}