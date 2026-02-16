const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Event Listeners: Handling toggle event
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

toggleSwitch.addEventListener("change", switchTheme, false);

//  Store color theme for future visits

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
  updateLogo();
}

// Update logo based on current theme
function updateLogo() {
  const logo = document.getElementById("site-logo");
  if (!logo) return;
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  const src = logo.getAttribute("src");
  if (isDark) {
    logo.src = src.replace(/light\.png/, "dark.png");
  } else {
    logo.src = src.replace(/dark\.png/, "light.png");
  }
}

// Save user preference on load

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

updateLogo();

// ================================
// Shared Footer
// ================================

(function loadSharedFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  // Determine asset path prefix based on page depth
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length;
  // Pages in subdirectories (e.g. /devblogs/devblog-001.html) need "../"
  // Root-level pages use "./"
  const prefix = path.includes("/devblogs/") ? ".." : ".";

  footer.innerHTML = `
    <div class="container">
      <a href="mailto:halfcompletecode@gmail.com">halfcompletecode@gmail.com</a>
      <div class="social">
        <a href="https://github.com/halfcomplete" target="_blank"><img src="${prefix}/assets/github-icon.svg" alt="GitHub" /></a>
      </div>
      <p>Copyright &copy; Eric Hu <span id="datee"></span>, All rights reserved</p>
    </div>
  `;

  // Set the year
  const dateEl = document.getElementById("datee");
  if (dateEl) {
    dateEl.innerHTML = new Date().getFullYear();
  }
})();

// ================================
// Devblog Search, Filter, and Sort
// ================================

const devblogList = document.getElementById('devblog-list');
const searchInput = document.getElementById('devblog-search-input');
const tagFilter = document.getElementById('tag-filter');
const sortSelect = document.getElementById('sort-select');
const noResults = document.getElementById('no-results');

if (devblogList && searchInput && tagFilter && sortSelect) {
  const devblogCards = Array.from(devblogList.querySelectorAll('.devblog-card'));

  function filterAndSortDevblogs() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedTag = tagFilter.value;
    const sortOption = sortSelect.value;

    // Filter cards
    let visibleCards = devblogCards.filter(card => {
      const title = card.dataset.title.toLowerCase();
      const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
      const excerpt = card.querySelector('.devblog-excerpt').textContent.toLowerCase();

      const matchesSearch = searchTerm === '' || 
        title.includes(searchTerm) || 
        excerpt.includes(searchTerm);
      const matchesTag = selectedTag === 'all' || tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    // Sort cards
    visibleCards.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.dataset.date) - new Date(a.dataset.date);
      } else if (sortOption === 'oldest') {
        return new Date(a.dataset.date) - new Date(b.dataset.date);
      } else if (sortOption === 'alphabetical') {
        return a.dataset.title.localeCompare(b.dataset.title);
      }
      return 0;
    });

    // Update visibility and order
    devblogCards.forEach(card => {
      card.classList.add('hidden');
    });

    visibleCards.forEach((card, index) => {
      card.classList.remove('hidden');
      card.style.order = index;
      // Reset animation
      card.style.animation = 'none';
      card.offsetHeight; // Trigger reflow
      card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    });

    // Show/hide no results message
    if (visibleCards.length === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }

  // Add event listeners
  searchInput.addEventListener('input', filterAndSortDevblogs);
  tagFilter.addEventListener('change', filterAndSortDevblogs);
  sortSelect.addEventListener('change', filterAndSortDevblogs);

  // Set devblog-list to use flexbox for ordering
  devblogList.style.display = 'flex';
  devblogList.style.flexDirection = 'column';
}
