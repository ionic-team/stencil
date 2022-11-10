const path = require('path');

const scriptsDir = __dirname;
const rootDir = path.join(scriptsDir, '..');

function main() {
  const scriptsBuildDir = path.join(scriptsDir, 'build');
  const scriptsBuildJs = path.join(scriptsBuildDir, 'build.js');
  const args = process.argv.slice(2);

  let build;
  try {
    build = require(scriptsBuildJs);
  } catch (requireError) {
    console.warn(`Unable to load build scripts: ${requireError}. Attempting to recompile them.`);
    process.exit(1);
  }
  build.run(rootDir, args);
}

main();
