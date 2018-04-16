const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const cp = require('child_process');


const ROOT_DIR = path.join(__dirname, '../');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-core');
const DIST_CLIENT_DIR = path.join(DST_DIR, 'client');
const POLYFILLS_SRC_DIR = path.join(ROOT_DIR, 'scripts', 'polyfills');
const POLYFILLS_DIST_DIR = path.join(DST_DIR, 'client', 'polyfills');
const DECLARATIONS_SRC_DIR = path.join(ROOT_DIR, 'scripts', 'declarations');
const DECLARATIONS_DIST_DIR = path.join(DST_DIR, 'client', 'declarations');

const inputFile = path.join(TRANSPILED_DIR, 'client/core.js');
const outputFile = path.join(DIST_CLIENT_DIR, 'core.build.js');


// transpile
cp.execSync('node ../node_modules/.bin/tsc -p ../src/tsconfig.json', { cwd: __dirname });


// empty out the dist/client directory
fs.ensureDirSync(DIST_CLIENT_DIR);


// tasks
bundleClientCore();
createIndexJs();
copyMainDTs();
copyClientFiles();
copyUtilDir();
buildLoader();


function bundleClientCore() {
  return rollup.rollup({
    input: inputFile,
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }
  })
  .then(bundle => {
    bundle.generate({
      format: 'es',
      intro: '(function(window, document, Context, namespace) {\n"use strict";\n',
      outro: '})(window, document, Context, namespace);'

    }).then(clientCore => {

      let code = clientCore.code.trim();
      code = dynamicImportFnHack(code);

      fs.writeFile(outputFile, code, (err) => {
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


function copyClientFiles() {
  fs.copySync(POLYFILLS_SRC_DIR, POLYFILLS_DIST_DIR);
  fs.copySync(DECLARATIONS_SRC_DIR, DECLARATIONS_DIST_DIR);
}


function copyMainDTs() {
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

function createIndexJs() {
  // create an empty index.js file so node resolve works
  const writeMainJsPath = path.join(DST_DIR, 'index.js');
  fs.writeFileSync(writeMainJsPath, '// @stencil/core');
}


function buildLoader() {
  const srcLoaderPath = path.join(TRANSPILED_DIR, 'client/loader.js');
  const dstLoaderPath = path.join(DST_DIR, 'client/loader.js');

  let content = fs.readFileSync(srcLoaderPath, 'utf-8');

  content = content.replace(/export function /g, 'function ');

  content = `(function(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

  ${content}

  init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

  })(window, document, '__APP__');`;

  fs.writeFileSync(dstLoaderPath, content);

  console.log(`✅ loader: ${dstLoaderPath}`);
}


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
  console.log(`✅ core: ${outputFile}`);
});
