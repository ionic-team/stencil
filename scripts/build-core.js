const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const transpile = require('./transpile');
const buildLoader = require('./build-loader');
const buildCoreEsm = require('./build-core-esm');
const buildPolyfills = require('./build-polyfills');


const ROOT_DIR = path.join(__dirname, '..');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-core');
const DIST_CLIENT_DIR = path.join(DST_DIR, 'client');
const DECLARATIONS_SRC_FILES = [
  path.join(SRC_DIR, 'declarations', 'component-interfaces.ts'),
  path.join(SRC_DIR, 'declarations', 'jsx.ts'),
  path.join(SRC_DIR, 'declarations', 'functional-components.ts')
];
const DECLARATIONS_DIST_FILE = path.join(DST_DIR, 'client', 'declarations', 'stencil.core.d.ts');

const inputCoreFile = path.join(TRANSPILED_DIR, 'client', 'core-browser.js');
const outputCoreFile = path.join(DIST_CLIENT_DIR, 'core.browser.js');

const inputCoreLegacyFile = path.join(TRANSPILED_DIR, 'client', 'core-browser-legacy.js');
const outputCoreLegacyFile = path.join(DIST_CLIENT_DIR, 'core.browser.legacy.js');

const inputLoaderFile = path.join(TRANSPILED_DIR, 'client', 'loader.js');
const outputLoaderFile = path.join(DST_DIR, 'client', 'loader.js');

const inputCoreEsmFile = path.join(TRANSPILED_DIR, 'client', 'core-esm.js');
const outputCoreEsmFile = path.join(DIST_CLIENT_DIR, 'core.esm.js');
const outputPolyfillsDir = path.join(DIST_CLIENT_DIR, 'polyfills');
const transpiledPolyfillsDir = path.join(TRANSPILED_DIR, 'client', 'polyfills');


const success = transpile(path.join('..', 'src', 'tsconfig.json'));

if (success) {

  // empty out the dist/client directory
  fs.ensureDirSync(path.dirname(outputCoreFile));
  fs.ensureDirSync(path.dirname(outputCoreEsmFile));


  // tasks
  bundleClientCore(inputCoreFile, outputCoreFile);
  bundleClientCore(inputCoreLegacyFile, outputCoreLegacyFile);

  buildLoader(inputLoaderFile, outputLoaderFile);
  buildCoreEsm(inputCoreEsmFile, outputCoreEsmFile);
  copyMain();
  createCoreDts();
  copyUtilDir();
  buildPolyfills(transpiledPolyfillsDir, outputPolyfillsDir);


  function bundleClientCore(inputCoreFile, outputCoreFile) {
    return rollup.rollup({
      input: inputCoreFile,
      onwarn: (message) => {
        if (/top level of an ES module/.test(message)) return;
        console.error( message );
      }
    })
    .then(bundle => {
      bundle.generate({
        format: 'es',

      }).then(clientCore => {

        let code = clientCore.code.trim();
        code = dynamicImportFnHack(code);

        fs.writeFile(outputCoreFile, code, (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }
        });

      })
    })
    .catch(err => {
      console.log(err);
      console.log(err.stack);
      process.exit(1);
    });
  }


  function dynamicImportFnHack(input) {
    // typescript is all tripped all by import()
    // nothing a good ol' string replace can't fix ;)
    return input.replace(/ __import\(/g, ' import(');
  }


  function createCoreDts() {
    const coreFileContents = DECLARATIONS_SRC_FILES
      .map(sf => fs.readFileSync(sf, { encoding: 'utf8'} ).toString())
      .join('\n');

    fs.ensureDirSync(path.dirname(DECLARATIONS_DIST_FILE));
    fs.writeFileSync(DECLARATIONS_DIST_FILE, coreFileContents);
  }


  function copyMain() {
    // create an empty index.js file so node resolve works
    const writeMainJsPath = path.join(DST_DIR, 'index.js');
    fs.writeFileSync(writeMainJsPath, '// @stencil/core');

    const readMainDTsPath = path.join(TRANSPILED_DIR, 'index.d.ts');
    const writeMainDTsPath = path.join(DST_DIR, 'index.d.ts');
    fs.copySync(readMainDTsPath, writeMainDTsPath);
  }


  function copyUtilDir() {
    const readUtilDirPath = path.join(TRANSPILED_DIR, 'util');
    const writeUtilDirPath = path.join(DST_DIR, 'util');

    fs.ensureDirSync(writeUtilDirPath);

    fs.readdir(readUtilDirPath, (err, fileNames) => {
      if (err) {
        console.log('failed to read dir: ', readUtilDirPath);
        return process.exit(1);
      }
      fileNames = fileNames.filter(fileName => {
        return fileName.endsWith('.d.ts');
      }).map(fileName => {
        return path.join(readUtilDirPath, fileName);
      }).forEach(fullPath => {
        const writePath = path.join(writeUtilDirPath, path.basename(fullPath));
        fs.copySync(fullPath, writePath);
      });

    })
  }

  process.on('exit', (code) => {
    fs.removeSync(TRANSPILED_DIR);
    console.log(`✅ core: ${outputCoreFile}`);
  });

}
