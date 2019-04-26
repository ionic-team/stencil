const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const ts = require('typescript');
const terser = require('terser');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = async function buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir) {
  await fs.emptyDir(outputPolyfillsDir);

  const files = (await fs.readdir(SRC_DIR)).filter(f => f.endsWith('.js'));

  await Promise.all(
    files.map(fileName => {
      const srcFilePath = path.join(SRC_DIR, fileName);
      const dstfilePath = path.join(outputPolyfillsDir, fileName);
      return fs.copyFile(srcFilePath, dstfilePath);
    })
  );


  const rollupBuild = await rollup.rollup({
    input: path.join(transpiledPolyfillsDir, 'css-shim', 'index.js'),
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error(message);
    }
  });

  const { output } = await rollupBuild.generate({ format: 'esm' });
  const transpile = ts.transpileModule(output[0].code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES5
    }
  });

  // const minify = terser.minify(transpile.outputText);

  const cssShimOutput = transpile.outputText;

  const mapPolyfillFilePath = path.join(SRC_DIR, 'map.js');
  const mapPolyfill = await fs.readFile(mapPolyfillFilePath, 'utf8');

  const cssShimMapPolyfill = mapPolyfill + '\n' + cssShimOutput;

  const filePath = path.join(outputPolyfillsDir, 'css-shim.js');

  await Promise.all([
    fs.writeFile(filePath, cssShimMapPolyfill)
  ]);
};
