const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = function buildPolyfills(outputPolyfillsDir) {

  fs.emptyDirSync(outputPolyfillsDir);

  const esmDir = path.join(outputPolyfillsDir, 'esm');
  fs.emptyDirSync(esmDir);

  const es5Dir = path.join(outputPolyfillsDir, 'es5');
  fs.emptyDirSync(es5Dir);

  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.js'));

  files.forEach(fileName => {
    const srcFilePath = path.join(SRC_DIR, fileName);
    const esmFilePath = path.join(esmDir, fileName);
    const es5FilePath = path.join(es5Dir, fileName);

    const polyfillContent = fs.readFileSync(srcFilePath, 'utf8');

    const esmWrapped = [
      'export function applyPolyfill(window, document) {',
      polyfillContent,
      '}'
    ].join('\n');

    fs.writeFileSync(esmFilePath, esmWrapped);

    fs.writeFileSync(es5FilePath, polyfillContent);
  });
};
