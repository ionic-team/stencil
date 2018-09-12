const fs = require('fs-extra');
const path = require('path');
const Terser = require('terser');


function minify(filePath) {
  const input = fs.readFileSync(filePath, 'utf8');
  const results = Terser.minify(input);

  if (results.error) {
    throw new Error(results.error);
  }

  fs.writeFileSync(filePath, results.code);
}


const DIST = path.join(__dirname, '..', 'dist');
[
  path.join(DIST, 'sys', 'node', 'node-fetch.js'),
  path.join(DIST, 'sys', 'node', 'open-in-editor.js'),
  path.join(DIST, 'sys', 'node', 'sys-util.js'),
  path.join(DIST, 'sys', 'node', 'sys-worker.js'),
  path.join(DIST, 'sys', 'node', 'websocket.js'),
  path.join(DIST, 'mock-doc', 'index.js'),

].forEach(minify);


const DIST_LICENSES = path.join(DIST, 'sys', 'node', 'LICENSES');
fs.emptyDirSync(DIST_LICENSES);

[
  'autoprefixer',
  'clean-css',
  'glob',
  'is-glob',
  'minimatch',
  'node-fetch',
  'opn',
  'postcss',
  'semver',
  'terser',
  'turbocolor',
  'ws',

].forEach(copyLicense);

function copyLicense(moduleId) {
  let licenseSrcPath = null;

  try {
    const licensePath = path.join(__dirname, '..', 'node_modules', moduleId, 'LICENSE');
    fs.accessSync(licensePath);
    licenseSrcPath = licensePath;

  } catch (e) {
    const licensePath = path.join(__dirname, '..', 'node_modules', moduleId, 'LICENSE.md');
    fs.accessSync(licensePath);
    licenseSrcPath = licensePath;
  }

  const licenseDistPath = path.join(DIST_LICENSES, moduleId + '.md');
  fs.copyFileSync(licenseSrcPath, licenseDistPath);
}
