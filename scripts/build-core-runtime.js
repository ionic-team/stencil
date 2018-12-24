const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');

const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-runtime');
const DIST_RUNTIME_DIR = path.join(DST_DIR, 'runtime');

const inputFile = path.join(TRANSPILED_DIR, 'core-runtime', 'index.js');
const outputFile = path.join(DIST_RUNTIME_DIR, 'index.js');


async function bundleRuntimeCore() {
  const build = await rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error(message);
    }
  });

  const results = await build.generate({
    format: 'es',
  });

  let code = results.code.trim();
  // typescript is all tripped all by import()
  // nothing a good ol' string replace can't fix ;)
  code = code.replace(/ __import\(/g, ' import(');

  fs.writeFileSync(outputFile, code);
}

process.on('exit', () => {
  fs.removeSync(TRANSPILED_DIR);
  console.log(`✅ runtime: ${outputFile}`);
});


const success = transpile(path.join('..', 'src', 'core-runtime', 'tsconfig.json'));

if (success) {
  fs.emptyDirSync(DIST_RUNTIME_DIR);

  bundleRuntimeCore();
}
