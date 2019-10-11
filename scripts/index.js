const fs = require('fs');
const path = require('path');


function main() {
  const rootDir = path.join(__dirname, '..');
  const scriptsDir = path.join(rootDir, 'scripts');
  const scriptsBuildDir = path.join(scriptsDir, 'build');

  if (!fs.existsSync(scriptsBuildDir)) {
    // ensure we've transpiled the build scripts first
    console.log('🧩  transpiling build scripts');
    const tscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');
    const tsconfig = path.join(scriptsDir, 'tsconfig.json');
    const execa = require('execa');
    execa.sync(tscPath, [
      '-p',
      tsconfig
    ]);
  }

  const build = require(path.join(scriptsBuildDir, 'build.js'));
  build.run(rootDir, process.argv.slice(2));
}

main();
