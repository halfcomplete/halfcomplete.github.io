#!/usr/bin/env node

/**
 * Devblog Build Script
 * 
 * Converts markdown files from docs/assets/devblogs/ into HTML pages in docs/devblogs/
 * and updates the devblogs listing page.
 * 
 * Usage:
 *   npm run build:devblogs        # Build once
 *   npm run watch:devblogs        # Watch for changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const { marked } = require('marked');
const leven = require('leven').default || require('leven');


// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true
});

// Predefined allowed tags
const ALLOWED_TAGS = ['Ashborne', 'FSE', 'VEX', 'Technical Deep Dive', 'High-level Design', 'Algorithms & Problem Solving', 'Reflection', 'Simulation & Modeling', 'General / Project Updates'];

// Paths
const SRC_DEVBLOGS = path.join(__dirname, '..', 'docs', 'assets', 'devblogs');
const DOCS_DEVBLOGS = path.join(__dirname, '..', 'docs', 'devblogs');
const DOCS_ASSETS = path.join(__dirname, '..', 'docs', 'assets', 'devblogs');
const DEVBLOGS_LISTING = path.join(__dirname, '..', 'docs', 'devblogs.html');

// HTML Template for individual devblog pages
function generateDevblogHTML(frontmatter, content, prevDevblog, nextDevblog) {
  const { slug, title, description, date, tags } = frontmatter;
  const formattedDate = formatDate(date);
  const isoDate = formatISODate(date);
  
  // Parse tags (comma and space separated)
  const tagsArray = parseTags(tags);
  const tagsHTML = tagsArray.map(t => `<span class="devblog-tag">${escapeHTML(t)}</span>`).join(' ');
  
  // Process markdown content and handle images
  const processedContent = processMarkdownContent(content, slug);
  const htmlContent = marked.parse(processedContent);
  
  // Wrap first paragraph in lead class
  const contentWithLead = htmlContent.replace(
    /^<p>(.*?)<\/p>/,
    '<p class="lead">$1</p>'
  );

  // Generate prev/next navigation
  const prevLink = prevDevblog
    ? `<a href="${prevDevblog.slug}.html" class="devblog-nav-link prev">
        <span><i class="fas fa-arrow-left"></i> Previous</span>
        <span class="devblog-nav-title">${prevDevblog.title}</span>
      </a>`
    : `<a href="#" class="devblog-nav-link prev disabled">
        <span><i class="fas fa-arrow-left"></i> Previous</span>
        <span class="devblog-nav-title">No previous devblog</span>
      </a>`;

  const nextLink = nextDevblog
    ? `<a href="${nextDevblog.slug}.html" class="devblog-nav-link next">
        <span>Next <i class="fas fa-arrow-right"></i></span>
        <span class="devblog-nav-title">${nextDevblog.title}</span>
      </a>`
    : `<a href="#" class="devblog-nav-link next disabled">
        <span>Next <i class="fas fa-arrow-right"></i></span>
        <span class="devblog-nav-title">Coming soon...</span>
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
            <li><a class="nav-link" href="../devblogs.html">DEVBLOGS</a></li>
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

    <!-- Devblog Article -->
    <article class="devblog-article container">
      <header class="devblog-article-header">
        <a href="../devblogs.html" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Devblogs
        </a>
        <div class="devblog-article-meta">
          ${tagsHTML}
          <span class="devblog-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        </div>
        <h1>${escapeHTML(title)}</h1>
      </header>

      <div class="devblog-article-content">
        ${contentWithLead}
      </div>

      <footer class="devblog-article-footer">
        <div class="devblog-nav">
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

// Generate devblog card HTML for listing page
function generateDevblogCard(frontmatter) {
  const { slug, title, date, tags, excerpt } = frontmatter;
  const formattedDate = formatDate(date);
  const isoDate = formatISODate(date);
  
  // Parse tags (comma and space separated)
  const tagsArray = parseTags(tags);
  const tagsDataAttr = tagsArray.join(',');
  const tagsHTML = tagsArray.map(t => `<span class="devblog-tag">${escapeHTML(t)}</span>`).join(' ');

  return `        <!-- Devblog: ${slug} -->
        <article class="devblog-card" data-date="${isoDate}" data-tags="${escapeHTML(tagsDataAttr)}" data-title="${escapeHTML(title)}">
          <div class="devblog-meta">
            <span class="devblog-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
            ${tagsHTML}
          </div>
          <h2 class="devblog-title">
            <a href="devblogs/${slug}.html">${escapeHTML(title)}</a>
          </h2>
          <p class="devblog-excerpt">
            ${escapeHTML(excerpt)}
          </p>
          <a href="devblogs/${slug}.html" class="devblog-read-more">
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
    
    // Get source image path (relative to src/devblogs/)
    const srcImagePath = path.join(SRC_DEVBLOGS, imagePath);
    
    // Create organized destination: assets/devblogs/{slug}/
    const destDir = path.join(DOCS_ASSETS, slug);
    const imageFilename = path.basename(imagePath);
    const destImagePath = path.join(destDir, imageFilename);
    
    // Copy image if it exists
    if (fs.existsSync(srcImagePath)) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(srcImagePath, destImagePath);
      console.log(`  Copied image: ${imagePath} -> assets/devblogs/${slug}/${imageFilename}`);
    } else {
      console.warn(`  Warning: Image not found: ${srcImagePath}`);
    }
    
    // Return updated markdown with new path
    return `![${alt}](../assets/devblogs/${slug}/${imageFilename})`;
  });
}

// Update the devblogs listing page
function updateDevblogsListing(devblogs) {
  let listingHTML = fs.readFileSync(DEVBLOGS_LISTING, 'utf-8');
  
  // Sort devblogs by date (newest first)
  const sortedDevblogs = [...devblogs].sort((a, b) => 
    new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );
  
  // Generate all devblog cards
  const cardsHTML = sortedDevblogs
    .map(d => generateDevblogCard(d.frontmatter))
    .join('\n\n');
  
  // Collect unique tags from all devblogs
  const allTags = devblogs.flatMap(d => parseTags(d.frontmatter.tags));
  const uniqueTags = [...new Set(allTags)].sort();
  const tagOptionsHTML = uniqueTags
    .map(tag => `              <option value="${escapeHTML(tag)}">${escapeHTML(tag)}</option>`)
    .join('\n');
  
  // Replace devblog list content
  const listRegex = /<div class="devblog-list" id="devblog-list">[\s\S]*?<\/div>\s*<p class="no-results"/;
  listingHTML = listingHTML.replace(
    listRegex,
    `<div class="devblog-list" id="devblog-list">\n${cardsHTML}\n      </div>\n\n      <p class="no-results"`
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
  
  fs.writeFileSync(DEVBLOGS_LISTING, listingHTML);
  console.log('Updated devblogs.html listing page');
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

// Parse comma-separated tags
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  return String(tagsStr).split(', ').map(t => t.trim()).filter(t => t.length > 0);
}

// Main build function
async function build() {
  console.log('Building devblogs...\n');

  // Ensure output directories exist
  fs.mkdirSync(DOCS_DEVBLOGS, { recursive: true });
  fs.mkdirSync(DOCS_ASSETS, { recursive: true });

  // Find all markdown files
  const mdFiles = await glob('*.md', { cwd: SRC_DEVBLOGS });

  if (mdFiles.length === 0) {
    console.log('No markdown files found in src/devblogs/');
    return;
  }

  const devblogs = [];
  const skippedFiles = [];

  // Parse all devblogs
  for (const file of mdFiles) {
    try {
      const filePath = path.join(SRC_DEVBLOGS, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);

      // Validate required frontmatter
      const required = ['slug', 'title', 'description', 'date', 'tags', 'excerpt'];
      for (const field of required) {
        if (!frontmatter[field]) {
          throw new Error(`Missing required frontmatter field '${field}'`);
        }
      }

      // Validate tags
      const tagsArray = parseTags(frontmatter.tags);
      for (const tag of tagsArray) {
        if (!ALLOWED_TAGS.includes(tag)) {
          // Find closest allowed tag
          let closest = null;
          let minDistance = Infinity;

          for (const allowed of ALLOWED_TAGS) {
            const distance = leven(tag, allowed);
            if (distance < minDistance) {
              minDistance = distance;
              closest = allowed;
            }
          }

          const suggestion = (minDistance <= 2) ? ` Did you mean '${closest}'?` : '';
          throw new Error(`Invalid tag '${tag}'.${suggestion} Allowed tags: ${ALLOWED_TAGS.join(', ')}`);
        }
      }

      devblogs.push({ file, frontmatter, content });

    } catch (err) {
      skippedFiles.push({ file, error: err.message });
      console.warn(`Skipping ${file}: ${err.message}`);
    }
  }

  if (devblogs.length === 0) {
    console.log('No valid devblogs to process.');
    return;
  }

  // Sort by date for prev/next navigation
  devblogs.sort((a, b) => new Date(a.frontmatter.date) - new Date(b.frontmatter.date));

  // Generate HTML for each devblog
  for (let i = 0; i < devblogs.length; i++) {
    const { file, frontmatter, content } = devblogs[i];
    const prevDevblog = i > 0 ? devblogs[i - 1].frontmatter : null;
    const nextDevblog = i < devblogs.length - 1 ? devblogs[i + 1].frontmatter : null;

    console.log(`Processing: ${file}`);
    const html = generateDevblogHTML(frontmatter, content, prevDevblog, nextDevblog);
    const outputPath = path.join(DOCS_DEVBLOGS, `${frontmatter.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`  Generated: docs/devblogs/${frontmatter.slug}.html`);
  }

  // Update listing page
  console.log('');
  updateDevblogsListing(devblogs);

  console.log(`\nBuild complete! Generated ${devblogs.length} devblog(s).`);

  // Print skipped files at the end
  if (skippedFiles.length > 0) {
    console.log('\nSkipped files due to errors:');
    skippedFiles.forEach(f => console.log(`- ${f.file}: ${f.error}`));
  }
}


// Watch mode
async function watch() {
  const chokidar = require('chokidar');
  
  console.log('Watching for changes in src/devblogs/...\n');
  
  // Initial build
  await build();
  
  // Watch for changes
  const watcher = chokidar.watch(SRC_DEVBLOGS, {
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
