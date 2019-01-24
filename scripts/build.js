const fs = require('fs-extra');
const path = require('path');
const transpile = require('./transpile');
const { execSync, fork } = require('child_process');

const SCRIPTS_DIR = __dirname;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const BUILD_ID = getBuildId();

execSync('npm install resolve@1.8.1', {
  cwd: path.join(__dirname, '..', 'node_modules', 'rollup-plugin-node-resolve')
});

fs.removeSync(DIST_DIR);

transpile(path.join('..', 'src', 'build-conditionals', 'tsconfig.json'));

execSync('node build-mock-doc.js', {
  cwd: path.join(SCRIPTS_DIR)
});

[
  'build-cli.js',
  'build-compiler.js',
  'build-core.js',
  'build-dev-server.js',
  'build-dev-server-client.js',
  'build-renderer-vdom.js',
  'build-screenshot.js',
  'build-server.js',
  'build-submodules.js',
  'build-sys-node.js',
  'build-testing.js'

].forEach(script => fork(path.join(SCRIPTS_DIR, script), [`--build-id=${BUILD_ID}`]));


function getBuildId() {
  const d = new Date();

  let buildId = ('0' + d.getUTCFullYear()).slice(-2);
  buildId += ('0' + d.getUTCMonth()).slice(-2);
  buildId += ('0' + d.getUTCDate()).slice(-2);
  buildId += ('0' + d.getUTCHours()).slice(-2);
  buildId += ('0' + d.getUTCMinutes()).slice(-2);
  buildId += ('0' + d.getUTCSeconds()).slice(-2);

  return buildId;
}
