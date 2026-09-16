// Copies the app and its offline assets into www/ (the folder Capacitor packages).
import fs from 'node:fs';
import path from 'node:path';

const out = 'www';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'lib'), { recursive: true });
fs.mkdirSync(path.join(out, 'fonts'), { recursive: true });

fs.copyFileSync('src/index.html', path.join(out, 'index.html'));

const pdfjs = 'node_modules/pdfjs-dist/build';
for (const f of ['pdf.min.js', 'pdf.worker.min.js']) {
  fs.copyFileSync(path.join(pdfjs, f), path.join(out, 'lib', f));
}

const fonts = 'node_modules/@fontsource/atkinson-hyperlegible/files';
for (const w of [400, 700]) {
  fs.copyFileSync(
    path.join(fonts, `atkinson-hyperlegible-latin-${w}-normal.woff2`),
    path.join(out, 'fonts', `atkinson-${w}.woff2`),
  );
}

console.log('Built www/');
