// Copies the app and its offline assets into www/ (the folder Capacitor packages).
import fs from 'node:fs';
import path from 'node:path';

const out = 'www';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'lib'), { recursive: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });

fs.copyFileSync('src/index.html', path.join(out, 'index.html'));

const libs = {
  'node_modules/pdfjs-dist/build/pdf.min.js': 'pdf.min.js',
  'node_modules/pdfjs-dist/build/pdf.worker.min.js': 'pdf.worker.min.js',
  'node_modules/mammoth/mammoth.browser.min.js': 'mammoth.browser.min.js',
  'node_modules/jszip/dist/jszip.min.js': 'jszip.min.js',
};
for (const [from, to] of Object.entries(libs)) fs.copyFileSync(from, path.join(out, 'lib', to));

const fontsource = (pkg, file) => path.join('node_modules/@fontsource', pkg, 'files', file);
const fonts = {
  'atkinson-400.woff2': fontsource('atkinson-hyperlegible', 'atkinson-hyperlegible-latin-400-normal.woff2'),
  'atkinson-700.woff2': fontsource('atkinson-hyperlegible', 'atkinson-hyperlegible-latin-700-normal.woff2'),
  'literata-400.woff2': fontsource('literata', 'literata-latin-400-normal.woff2'),
  'literata-700.woff2': fontsource('literata', 'literata-latin-700-normal.woff2'),
  'opendyslexic-400.woff2': fontsource('opendyslexic', 'opendyslexic-latin-400-normal.woff2'),
  'opendyslexic-700.woff2': fontsource('opendyslexic', 'opendyslexic-latin-700-normal.woff2'),
  'mukta-deva-400.woff2': fontsource('mukta', 'mukta-devanagari-400-normal.woff2'),
  'mukta-deva-700.woff2': fontsource('mukta', 'mukta-devanagari-700-normal.woff2'),
  'mukta-latin-400.woff2': fontsource('mukta', 'mukta-latin-400-normal.woff2'),
  'mukta-latin-700.woff2': fontsource('mukta', 'mukta-latin-700-normal.woff2'),
};
for (const [to, from] of Object.entries(fonts)) fs.copyFileSync(from, path.join(out, 'fonts', to));

console.log('Built www/');
