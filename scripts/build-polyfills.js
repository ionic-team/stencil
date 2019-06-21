const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const ts = require('typescript');
const terser = require('terser');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = async function buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir) {
  await fs.emptyDir(outputPolyfillsDir);

  const filesSrc = (await fs.readdir(SRC_DIR)).filter(f => f.endsWith('.js'));
  await Promise.all(
    filesSrc.map(fileName => {
      const srcFilePath = path.join(SRC_DIR, fileName);
      const dstfilePath = path.join(transpiledPolyfillsDir, fileName);
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

  const cssShimOutput = transpile.outputText;
  const filePath = path.join(transpiledPolyfillsDir, 'css-shim.js');
  await fs.writeFile(filePath, cssShimOutput);

  const filesTranspiled = (await fs.readdir(transpiledPolyfillsDir)).filter(f => f.endsWith('.js'));
  await Promise.all(
    filesTranspiled.map(fileName => {
      const srcFilePath = path.join(transpiledPolyfillsDir, fileName);
      const dstfilePath = path.join(outputPolyfillsDir, fileName);
      return fs.copyFile(srcFilePath, dstfilePath);
    })
  );
};
