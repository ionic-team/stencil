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
    try {
      // it's possible that this script was run without --prepare and the JS output is in a broken state. let's see if
      // a recompilation will fix that
      build = require(scriptsBuildJs);
    } catch (rebuildError) {
      console.error(`Unable to find scripts. Exiting. ${rebuildError}`);
      process.exit(1);
    }
  }
  build.run(rootDir, args);
}

main();
