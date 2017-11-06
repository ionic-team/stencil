const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const ROOT_DIR = path.join(__dirname, '../');
const DST_DIR = path.join(ROOT_DIR, 'dist');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const TRANSPILED_DIR = path.join(DST_DIR, 'transpiled-core');
const DIST_CLIENT_DIR = path.join(DST_DIR, 'client');
const POLYFILLS_SRC_DIR = path.join(ROOT_DIR, 'scripts', 'polyfills');
const POLYFILLS_DIST_DIR = path.join(DST_DIR, 'client', 'polyfills');


// empty out the dist/client directory
fs.ensureDirSync(DIST_CLIENT_DIR);


// tasks
bundleClientCore();
copyLoader();
createIndexJs();
copyMainDTs();
copyPolyfills();
copyUtilDir();


function bundleClientCore() {
  const inputFile = path.join(TRANSPILED_DIR, 'client/core.js');
  const outputFile = path.join(DIST_CLIENT_DIR, 'core.build.js');

  return rollup.rollup({
    input: inputFile
  })
  .then(bundle => {
    bundle.generate({
      format: 'es',
      intro: '(function(window, document, Context, appNamespace, publicPath) {\n"use strict";\n',
      outro: '})(window, document, Context, appNamespace, publicPath);'

    }).then(clientCore => {

      fs.writeFile(outputFile, clientCore.code.trim(), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('built core:', outputFile);
        }
      });

    })
  })
  .catch(err => {
    console.log(err);
    console.log(err.stack);
  });
}


function copyPolyfills() {
  fs.copySync(POLYFILLS_SRC_DIR, POLYFILLS_DIST_DIR);
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


function copyLoader() {
  const srcLoaderPath = path.join(TRANSPILED_DIR, 'client/loader.js');
  const dstLoaderPath = path.join(DST_DIR, 'client/loader.js');
  fs.copySync(srcLoaderPath, dstLoaderPath);
}


process.on('exit', (code) => {
  // fs.removeSync(TRANSPILED_DIR);
});
