// Project 3 - Dark / Light Mode
const toggleBtn = document.getElementById('themeToggle');
const modeLabel = document.getElementById('modeLabel');
const root = document.documentElement;

// Check saved or system preference
const savedTheme = localStorage.getItem('syntecxhub-theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

function applyTheme(theme){
  root.setAttribute('data-theme', theme); // JS changes colors dynamically
  localStorage.setItem('syntecxhub-theme', theme); // Save preference
  modeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
}

applyTheme(initialTheme);

toggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});