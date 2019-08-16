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
  path.join(DIST, 'sys', 'node', 'graceful-fs.js'),
  path.join(DIST, 'sys', 'node', 'node-fetch.js'),
  path.join(DIST, 'sys', 'node', 'open-in-editor.js'),
  path.join(DIST, 'sys', 'node', 'sys-worker.js'),
  path.join(DIST, 'sys', 'node', 'websocket.js'),
  path.join(DIST, 'sys', 'node', 'index.js'),
  path.join(DIST, 'mock-doc', 'index.js'),

].forEach(minify);


const DIST_LICENSES = path.join(DIST, 'licenses');
fs.emptyDirSync(DIST_LICENSES);

[
  'ansi-colors',
  'autoprefixer',
  'cssnano',
  'css-what',
  'exit',
  'glob',
  'graceful-fs',
  'inquirer',
  'is-glob',
  'minimatch',
  'node-fetch',
  'open',
  'parse5',
  'pixelmatch',
  'pngjs',
  'postcss',
  'rollup',
  'rollup-plugin-commonjs',
  'rollup-plugin-node-resolve',
  'semver',
  'terser',
  'ws',

].forEach(copyLicense);

function copyLicense(moduleId) {
  let licenseSrcPath = null;

  try {
    const licensePath = path.join(__dirname, '..', 'node_modules', moduleId, 'LICENSE');
    fs.accessSync(licensePath);
    licenseSrcPath = licensePath;

  } catch (e) {

    try {
      const licensePath = path.join(__dirname, '..', 'node_modules', moduleId, 'LICENSE.md');
      fs.accessSync(licensePath);
      licenseSrcPath = licensePath;

    } catch (e) {
      try {
        const licensePath = path.join(__dirname, '..', 'node_modules', moduleId, 'LICENSE-MIT');
        fs.accessSync(licensePath);
        licenseSrcPath = licensePath;
      } catch (e) {}
    }
  }

  if (licenseSrcPath != null) {
    const licenseDistPath = path.join(DIST_LICENSES, moduleId + '.md');
    fs.copyFileSync(licenseSrcPath, licenseDistPath);

  } else {
    const licenseDistPath = path.join(DIST_LICENSES, moduleId + '.md');
    const pkgJsonFile = path.join(__dirname, '..', 'node_modules', moduleId, 'package.json');
    const pkgJson = fs.readJsonSync(pkgJsonFile);

    const content = `License: ${pkgJson.license}\n${pkgJson.homepage}`;

    fs.writeFileSync(licenseDistPath, content);
  }

}

process.on('exit', () => {
  const buildConditionals = path.join(__dirname, '..', 'dist', 'transpiled-build-conditionals');
  fs.removeSync(buildConditionals);
  console.log(`✅  prod build optimized`);
});
