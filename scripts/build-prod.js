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


process.on('exit', () => {
  const buildConditionals = path.join(__dirname, '..', 'dist', 'transpiled-build-conditionals');
  fs.removeSync(buildConditionals);
  console.log(`✅  prod build optimized`);
});
