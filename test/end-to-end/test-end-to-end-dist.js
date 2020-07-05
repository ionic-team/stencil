const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
fs.accessSync(path.join(distDir, 'cjs'));
fs.accessSync(path.join(distDir, 'endtoend'));
fs.accessSync(path.join(distDir, 'esm'));
fs.accessSync(path.join(distDir, 'esm-es5'));
fs.accessSync(path.join(distDir, 'loader'));
fs.accessSync(path.join(distDir, 'endtoend.js'));
fs.accessSync(path.join(distDir, 'index.js'));
fs.accessSync(path.join(distDir, 'index.mjs'));

fs.accessSync(path.join(distDir, 'endtoend', 'endtoend.css'));
fs.accessSync(path.join(distDir, 'endtoend', 'foo.css'));
fs.accessSync(path.join(distDir, 'endtoend', 'bar.css'));

const customElementsDir = path.join(distDir, 'custom-elements');
fs.accessSync(path.join(customElementsDir, 'index.d.ts'));
fs.accessSync(path.join(customElementsDir, 'index.js'));

const collectionDir = path.join(distDir, 'collection');
fs.accessSync(path.join(collectionDir, 'car-list', 'car-data.js'));
fs.accessSync(path.join(collectionDir, 'car-list', 'car-list.css'));
fs.accessSync(path.join(collectionDir, 'car-list', 'car-list.js'));
fs.accessSync(path.join(collectionDir, 'car-list', 'car-list.js'));
fs.accessSync(path.join(collectionDir, 'prop-cmp', 'prop-cmp.ios.css'));
fs.accessSync(path.join(collectionDir, 'prop-cmp', 'prop-cmp.md.css'));
fs.accessSync(path.join(collectionDir, 'global.js'));
JSON.parse(fs.readFileSync(path.join(collectionDir, 'collection-manifest.json'), 'utf8'));

const typesDir = path.join(distDir, 'types');
fs.accessSync(path.join(typesDir, 'components.d.ts'));
fs.accessSync(path.join(typesDir, 'stencil-public-runtime.d.ts'));
fs.accessSync(path.join(typesDir, 'car-list', 'car-data.d.ts'));
fs.accessSync(path.join(typesDir, 'car-list', 'car-list.d.ts'));

const wwwDir = path.join(__dirname, 'www');
fs.accessSync(path.join(wwwDir, 'build', 'endtoend.js'));
fs.accessSync(path.join(wwwDir, 'build', 'endtoend.esm.js'));
fs.accessSync(path.join(wwwDir, 'index.html'));

fs.accessSync(path.join(__dirname, 'dist-react', 'components.ts'));

console.log('🍄  validated test/end-to-end/dist files\n');
