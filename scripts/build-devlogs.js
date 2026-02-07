#!/usr/bin/env node

/**
 * Devlog Build Script
 * 
 * Converts markdown files from docs/assets/devlogs/ into HTML pages in docs/devlogs/
 * and updates the devlogs listing page.
 * 
 * Usage:
 *   npm run build:devlogs        # Build once
 *   npm run watch:devlogs        # Watch for changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { marked } = require('marked');

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true
});

// Paths
const SRC_DEVLOGS = path.join(__dirname, '..', 'docs', 'assets', 'devlogs');
const DOCS_DEVLOGS = path.join(__dirname, '..', 'docs', 'devlogs');
const DOCS_ASSETS = path.join(__dirname, '..', 'docs', 'assets', 'devlogs');
const DEVLOGS_LISTING = path.join(__dirname, '..', 'docs', 'devlogs.html');

// HTML Template for individual devlog pages
function generateDevlogHTML(frontmatter, content, prevDevlog, nextDevlog) {
  const { slug, title, description, date, tag } = frontmatter;
  const formattedDate = formatDate(date);
  const isoDate = formatISODate(date);
  
  // Process markdown content and handle images
  const processedContent = processMarkdownContent(content, slug);
  const htmlContent = marked.parse(processedContent);
  
  // Wrap first paragraph in lead class
  const contentWithLead = htmlContent.replace(
    /^<p>(.*?)<\/p>/,
    '<p class="lead">$1</p>'
  );

  // Generate prev/next navigation
  const prevLink = prevDevlog
    ? `<a href="${prevDevlog.slug}.html" class="devlog-nav-link prev">
        <span><i class="fas fa-arrow-left"></i> Previous</span>
        <span class="devlog-nav-title">${prevDevlog.title}</span>
      </a>`
    : `<a href="#" class="devlog-nav-link prev disabled">
        <span><i class="fas fa-arrow-left"></i> Previous</span>
        <span class="devlog-nav-title">No previous devlog</span>
      </a>`;

  const nextLink = nextDevlog
    ? `<a href="${nextDevlog.slug}.html" class="devlog-nav-link next">
        <span>Next <i class="fas fa-arrow-right"></i></span>
        <span class="devlog-nav-title">${nextDevlog.title}</span>
      </a>`
    : `<a href="#" class="devlog-nav-link next disabled">
        <span>Next <i class="fas fa-arrow-right"></i></span>
        <span class="devlog-nav-title">Coming soon...</span>
      </a>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Primary Meta Tags -->
    <title>${escapeHTML(title)} | halfcomplete</title>
    <meta name="title" content="${escapeHTML(title)} | halfcomplete" />
    <meta
      name="description"
      content="${escapeHTML(description)}"
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHTML(title)} | halfcomplete" />
    <meta
      property="og:description"
      content="${escapeHTML(description)}"
    />

    <!-- Link -->
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="../assets/favicon/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="../assets/favicon/favicon-16x16.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="../assets/favicon/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href="../assets/favicon/android-chrome-192x192.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="512x512"
      href="../assets/favicon/android-chrome-512x512.png"
    />
    <link rel="icon" type="image/x-icon" href="../assets/favicon/favicon.ico" />
    <link rel="manifest" href="../assets/favicon/site.webmanifest" />
    <link rel="preload" href="../assets/dark.png" as="image" />
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/utilities.css" />
  </head>
  <body>
    <header id="hero">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="container">
          <!-- Logo -->
          <h1 id="logo">
            <a href="../index.html"
              ><img id="site-logo" src="../assets/light.png" alt="halfcomplete logo"
            /></a>
          </h1>
          <!-- Navbar links -->
          <ul class="nav-menu">
            <li><a class="nav-link" href="../index.html#projects">PROJECTS</a></li>
            <li><a class="nav-link" href="../contact.html">CONTACT</a></li>
            <li><a class="nav-link" href="../devlogs.html">DEVLOGS</a></li>
            <li>
              <a
                class="nav-link btn btn-primary"
                href="https://github.com/CommunityPro/portfolio-html"
                >RESUME <i class="fas fa-arrow-right"></i
              ></a>
            </li>

            <!-- Toggle switch -->
            <div class="theme-switch">
              <input type="checkbox" id="switch" />
              <label class="toggle-icons" for="switch">
                <img class="moon" src="../assets/moon.svg" />
                <img class="sun" src="../assets/sun.svg" />
              </label>
            </div>
            <!-- Hamburger menu -->
          </ul>
          <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
      </nav>
    </header>

    <!-- Devlog Article -->
    <article class="devlog-article container">
      <header class="devlog-article-header">
        <a href="../devlogs.html" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Devlogs
        </a>
        <div class="devlog-article-meta">
          <span class="devlog-tag">${escapeHTML(tag)}</span>
          <span class="devlog-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        </div>
        <h1>${escapeHTML(title)}</h1>
      </header>

      <div class="devlog-article-content">
        ${contentWithLead}
      </div>

      <footer class="devlog-article-footer">
        <div class="devlog-nav">
          ${prevLink}
          ${nextLink}
        </div>
      </footer>
    </article>

    <footer id="footer"></footer>
    <script src="../js/script.js"></script>
  </body>
</html>
`;
}

// Generate devlog card HTML for listing page
function generateDevlogCard(frontmatter) {
  const { slug, title, date, tag, excerpt } = frontmatter;
  const formattedDate = formatDate(date);
  const isoDate = formatISODate(date);

  return `        <!-- Devlog: ${slug} -->
        <article class="devlog-card" data-date="${isoDate}" data-tag="${escapeHTML(tag)}" data-title="${escapeHTML(title)}">
          <div class="devlog-meta">
            <span class="devlog-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
            <span class="devlog-tag">${escapeHTML(tag)}</span>
          </div>
          <h2 class="devlog-title">
            <a href="devlogs/${slug}.html">${escapeHTML(title)}</a>
          </h2>
          <p class="devlog-excerpt">
            ${escapeHTML(excerpt)}
          </p>
          <a href="devlogs/${slug}.html" class="devlog-read-more">
            Read More <i class="fas fa-arrow-right"></i>
          </a>
        </article>`;
}

// Process markdown content - handle image paths and copy images
function processMarkdownContent(content, slug) {
  // Match markdown images: ![alt](path)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imageRegex, (match, alt, imagePath) => {
    // Skip external URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return match;
    }
    
    // Get source image path (relative to src/devlogs/)
    const srcImagePath = path.join(SRC_DEVLOGS, imagePath);
    
    // Create organized destination: assets/devlogs/{slug}/
    const destDir = path.join(DOCS_ASSETS, slug);
    const imageFilename = path.basename(imagePath);
    const destImagePath = path.join(destDir, imageFilename);
    
    // Copy image if it exists
    if (fs.existsSync(srcImagePath)) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(srcImagePath, destImagePath);
      console.log(`  Copied image: ${imagePath} -> assets/devlogs/${slug}/${imageFilename}`);
    } else {
      console.warn(`  Warning: Image not found: ${srcImagePath}`);
    }
    
    // Return updated markdown with new path
    return `![${alt}](../assets/devlogs/${slug}/${imageFilename})`;
  });
}

// Update the devlogs listing page
function updateDevlogsListing(devlogs) {
  let listingHTML = fs.readFileSync(DEVLOGS_LISTING, 'utf-8');
  
  // Sort devlogs by date (newest first)
  const sortedDevlogs = [...devlogs].sort((a, b) => 
    new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );
  
  // Generate all devlog cards
  const cardsHTML = sortedDevlogs
    .map(d => generateDevlogCard(d.frontmatter))
    .join('\n\n');
  
  // Collect unique tags
  const tags = [...new Set(devlogs.map(d => d.frontmatter.tag))].sort();
  const tagOptionsHTML = tags
    .map(tag => `              <option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`)
    .join('\n');
  
  // Replace devlog list content
  const listRegex = /<div class="devlog-list" id="devlog-list">[\s\S]*?<\/div>\s*<p class="no-results"/;
  listingHTML = listingHTML.replace(
    listRegex,
    `<div class="devlog-list" id="devlog-list">\n${cardsHTML}\n      </div>\n\n      <p class="no-results"`
  );
  
  // Update tag filter options
  const tagFilterRegex = /<select id="tag-filter">[\s\S]*?<\/select>/;
  listingHTML = listingHTML.replace(
    tagFilterRegex,
    `<select id="tag-filter">
              <option value="all">All Tags</option>
${tagOptionsHTML}
            </select>`
  );
  
  fs.writeFileSync(DEVLOGS_LISTING, listingHTML);
  console.log('Updated devlogs.html listing page');
}

// Helper functions
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatISODate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Main build function
async function build() {
  console.log('Building devlogs...\n');
  
  // Ensure output directories exist
  fs.mkdirSync(DOCS_DEVLOGS, { recursive: true });
  fs.mkdirSync(DOCS_ASSETS, { recursive: true });
  
  // Find all markdown files
  const mdFiles = await glob('*.md', { cwd: SRC_DEVLOGS });
  
  if (mdFiles.length === 0) {
    console.log('No markdown files found in src/devlogs/');
    return;
  }
  
  // Parse all devlogs
  const devlogs = mdFiles.map(file => {
    const filePath = path.join(SRC_DEVLOGS, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Validate required frontmatter
    const required = ['slug', 'title', 'description', 'date', 'tag', 'excerpt'];
    for (const field of required) {
      if (!frontmatter[field]) {
        throw new Error(`Missing required frontmatter field '${field}' in ${file}`);
      }
    }
    
    return { file, frontmatter, content };
  });
  
  // Sort by date for prev/next navigation
  devlogs.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date));
  
  // Generate HTML for each devlog
  for (let i = 0; i < devlogs.length; i++) {
    const { file, frontmatter, content } = devlogs[i];
    const prevDevlog = i > 0 ? devlogs[i - 1].frontmatter : null;
    const nextDevlog = i < devlogs.length - 1 ? devlogs[i + 1].frontmatter : null;
    
    console.log(`Processing: ${file}`);
    
    const html = generateDevlogHTML(frontmatter, content, prevDevlog, nextDevlog);
    const outputPath = path.join(DOCS_DEVLOGS, `${frontmatter.slug}.html`);
    
    fs.writeFileSync(outputPath, html);
    console.log(`  Generated: docs/devlogs/${frontmatter.slug}.html`);
  }
  
  // Update listing page
  console.log('');
  updateDevlogsListing(devlogs);
  
  console.log(`\nBuild complete! Generated ${devlogs.length} devlog(s).`);
}

// Watch mode
async function watch() {
  const chokidar = require('chokidar');
  
  console.log('Watching for changes in src/devlogs/...\n');
  
  // Initial build
  await build();
  
  // Watch for changes
  const watcher = chokidar.watch(SRC_DEVLOGS, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  
  watcher.on('change', async (filePath) => {
    console.log(`\nFile changed: ${filePath}`);
    await build();
  });
  
  watcher.on('add', async (filePath) => {
    console.log(`\nFile added: ${filePath}`);
    await build();
  });
  
  watcher.on('unlink', async (filePath) => {
    console.log(`\nFile removed: ${filePath}`);
    await build();
  });
}

// Run
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  watch().catch(console.error);
} else {
  build().catch(console.error);
}
