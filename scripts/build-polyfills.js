const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const ts = require('typescript');
const terser = require('terser');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = async function buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir) {
  fs.emptyDirSync(outputPolyfillsDir);

  const esmDir = path.join(outputPolyfillsDir, 'esm');
  fs.emptyDirSync(esmDir);

  const es5Dir = path.join(outputPolyfillsDir, 'es5');
  fs.emptyDirSync(es5Dir);

  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.js'));

  files.forEach(fileName => {
    const srcFilePath = path.join(SRC_DIR, fileName);
    const esmFilePath = path.join(esmDir, fileName);
    const es5FilePath = path.join(es5Dir, fileName);

    const polyfillContent = fs.readFileSync(srcFilePath, 'utf8');

    const esmWrapped = (fileName === 'tslib.js')
      ? polyfillContent
      : esmWrap(polyfillContent);

    fs.writeFileSync(esmFilePath, esmWrapped);
    fs.writeFileSync(es5FilePath, polyfillContent);
  });


  const build = await rollup.rollup({
    input: path.join(transpiledPolyfillsDir, 'css-shim', 'index.js'),
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }
  });

  const bundleResults = await build.generate({
    format: 'es'
  });

  const transpile = ts.transpileModule(bundleResults.output[0].code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES5
    }
  });

  const minify = terser.minify(transpile.outputText);

  const cssShimOutput = minify.code;

  const es6shimPolyfillFilePath = path.join(SRC_DIR, 'es6shim.js');
  const es6shimPolyfill = fs.readFileSync(es6shimPolyfillFilePath, 'utf8');

  const cssShimEs6shimPolyfill = es6shimPolyfill + '\n' + cssShimOutput;

  const esmFilePath = path.join(esmDir, 'css-shim.js');
  const es5FilePath = path.join(es5Dir, 'css-shim.js');

  fs.writeFileSync(esmFilePath, esmWrap(cssShimEs6shimPolyfill));
  fs.writeFileSync(es5FilePath, cssShimEs6shimPolyfill);
};


function esmWrap(polyfillContent) {
  return `export function applyPolyfill(window, document) {${polyfillContent}}`;
}
