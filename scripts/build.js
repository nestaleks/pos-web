const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'features.html', 'industries.html', 'products.html', 'pricing.html', 'support.html'];
const errors = [];

function hasAnchor(filename, anchor) {
  const html = fs.readFileSync(filename, 'utf8');
  const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=["']${escaped}["']`).test(html);
}

function exists(reference, fromFile) {
  if (/^(?:https?:|mailto:|tel:|data:)/.test(reference)) return true;
  const [pathname, hash] = reference.split('#');
  if (!pathname && hash) return hasAnchor(fromFile, hash);
  const target = path.resolve(path.dirname(fromFile), pathname || path.basename(fromFile));
  if (!target.startsWith(root) || !fs.existsSync(target)) return false;
  return !(hash && path.extname(target) === '.html') || hasAnchor(target, hash);
}

for (const page of pages) {
  const filename = path.join(root, page);
  const html = fs.readFileSync(filename, 'utf8');
  if (!/<main\s+id="main-content">/.test(html)) errors.push(`${page}: missing main landmark`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+">/.test(html)) errors.push(`${page}: missing meta description`);
  if (/placehold\.co|href="#"|\bTODO\b/.test(html)) errors.push(`${page}: placeholder or empty link remains`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!exists(match[1], filename)) errors.push(`${page}: broken reference ${match[1]}`);
  }
}

for (const component of ['components/header.html', 'components/mobile-menu.html', 'components/footer.html']) {
  const filename = path.join(root, component);
  const html = fs.readFileSync(filename, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!exists(match[1], path.join(root, 'index.html'))) errors.push(`${component}: broken reference ${match[1]}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

if (!process.argv.includes('--check')) {
  const dist = path.resolve(root, 'dist');
  if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Unsafe output path');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  for (const directory of ['assets', 'components', 'css', 'js']) {
    fs.cpSync(path.join(root, directory), path.join(dist, directory), { recursive: true });
  }
  for (const page of pages) fs.copyFileSync(path.join(root, page), path.join(dist, page));
  console.log(`Production build created: ${dist}`);
} else {
  console.log('Validation passed.');
}
