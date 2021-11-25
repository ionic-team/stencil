const path = require('path');

const scriptsDir = __dirname;
const rootDir = path.join(scriptsDir, '..');

/**
 * Transpiles build scripts used to create the Stencil compiler artifact
 */
function transpileBuildScripts() {
  console.log('🧩  transpiling build scripts');
  const tscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');
  const tsconfig = path.join(scriptsDir, 'tsconfig.json');
  const execa = require('execa');
  execa.sync(tscPath, ['-p', tsconfig]);
}

function main() {
  const scriptsBuildDir = path.join(scriptsDir, 'build');
  const scriptsBuildJs = path.join(scriptsBuildDir, 'build.js');
  const args = process.argv.slice(2);

  if (args.includes('--prepare')) {
    // with --prepare always compile the scripts
    transpileBuildScripts();
  }

  let build;
  try {
    build = require(scriptsBuildJs);
  } catch (requireError) {
    console.warn(`Unable to load build scripts: ${requireError}. Attempting to recompile them.`);
    try {
      // it's possible that this script was run without --prepare and the JS output is in a broken state. let's see if
      // a recompilation will fix that
      transpileBuildScripts();
      build = require(scriptsBuildJs);
    } catch (rebuildError) {
      console.error(`Unable to recompile scripts. Exiting. ${rebuildError}`);
      process.exit(1);
    }
  }
  build.run(rootDir, args);
}

main();
