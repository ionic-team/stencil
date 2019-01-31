const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const ts = require('typescript');
const terser = require('terser');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = async function buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir) {
  await fs.emptyDir(outputPolyfillsDir);

  const esmDir = path.join(outputPolyfillsDir, 'esm');
  await fs.emptyDir(esmDir);

  const es5Dir = path.join(outputPolyfillsDir, 'es5');
  await fs.emptyDir(es5Dir);

  const files = (await fs.readdir(SRC_DIR)).filter(f => f.endsWith('.js'));

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


  const rollupBuild = await rollup.rollup({
    input: path.join(transpiledPolyfillsDir, 'css-shim', 'index.js'),
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({
    format: 'esm'
  });

  const transpile = ts.transpileModule(output[0].code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES5
    }
  });

  const minify = terser.minify(transpile.outputText);

  const cssShimOutput = minify.code;

  const mapPolyfillFilePath = path.join(SRC_DIR, 'map.js');
  const mapPolyfill = await fs.readFile(mapPolyfillFilePath, 'utf8');

  const cssShimMapPolyfill = mapPolyfill + '\n' + cssShimOutput;

  const esmFilePath = path.join(esmDir, 'css-shim.js');
  const es5FilePath = path.join(es5Dir, 'css-shim.js');

  await Promise.all([
    fs.writeFile(esmFilePath, esmWrap(cssShimMapPolyfill)),
    fs.writeFile(es5FilePath, cssShimMapPolyfill)
  ]);
};


function esmWrap(polyfillContent) {
  return `export function applyPolyfill(window, document) {${polyfillContent}}`;
}
