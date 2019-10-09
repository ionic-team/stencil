const fs = require('fs');
const path = require('path');
const execa = require('execa');
const scriptsDir = __dirname;


function main() {
  if (fs.existsSync(path.join(scriptsDir, 'build'))) {
    return;
  }

  console.log('🧩  transpiling build scripts');
  const tscPath = path.join(scriptsDir, '..', 'node_modules', '.bin', 'tsc');
  const tsconfig = path.join(scriptsDir, 'tsconfig.json');
  execa.sync(tscPath, [
    '-p',
    tsconfig
  ]);
}

main();
