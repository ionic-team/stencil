const fs = require('fs-extra');
const path = require('path');


function main() {
  const scriptsDir = __dirname;
  const rootDir = path.join(scriptsDir, '..');
  const scriptsBuildDir = path.join(scriptsDir, 'build');
  const scriptsBuildJs = path.join(scriptsBuildDir, 'build.js');

  if (!fs.existsSync(scriptsBuildJs)) {
    // ensure we've transpiled the build scripts first
    console.log('🧩  transpiling build scripts');
    fs.emptyDirSync(scriptsBuildDir);
    const tscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');
    const tsconfig = path.join(scriptsDir, 'tsconfig.json');
    const execa = require('execa');
    execa.sync(tscPath, [
      '-p',
      tsconfig
    ]);
  }

  const build = require(scriptsBuildJs);
  build.run(rootDir, process.argv.slice(2));
}

main();
