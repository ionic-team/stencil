const path = require('path');

const scriptsDir = __dirname;
const rootDir = path.join(scriptsDir, '..');

function main() {
  const scriptsBuildDir = path.join(scriptsDir, 'build');
  const scriptsBuildJs = path.join(scriptsBuildDir, 'build.js');
  const args = process.argv.slice(2);
  const build = require(scriptsBuildJs);
  build.run(rootDir, args);
}

main();
