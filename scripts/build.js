const fs = require('fs-extra');
const path = require('path');
const fork = require('child_process').fork;

const SCRIPTS_DIR = __dirname;
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

const BUILD_ID = getBuildId();

fs.removeSync(DIST_DIR);

[
  'build-cli.js',
  'build-compiler.js',
  'build-core.js',
  'build-dev-server.js',
  'build-dev-server-client.js',
  'build-renderer-vdom.js',
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
