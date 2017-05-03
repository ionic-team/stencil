/**
 * Build Angular:
 * Build the core files for ionic-angular. We do not need
 * to create an ionic.js file because that is apart of
 * Ionic's providers during bootstrap. We also do not need
 * to bundle files because that will be done during a
 * user's build from within app-scripts.
 */


const DEV_MODE = process.argv.indexOf('dev') > -1;
const WATCH = process.argv.indexOf('watch') > -1;
const ionicDir = process.argv[2];

const BUNDLES = [
  { components: ['ion-badge'] },
  { components: ['ion-button'] },
  { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'] },
  { components: ['ion-gesture'], priority: 'low' },
  { components: ['ion-toggle'] },
  { components: ['ion-slides', 'ion-slide'] },
];


import { buildBindingCore } from './build-core';
import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as typescript from 'typescript';


// dynamic require cuz this file gets transpiled to dist/
const compilerPath = path.join(__dirname, '../compiler');
console.log('build-angular core, compilerPath:', compilerPath);
const compiler = require(compilerPath);


let srcDir = path.join(__dirname, '../../src');
let transpiledSrcDir = path.join(__dirname, '../transpiled-angular/bindings/angular/src');
let compiledDir = path.join(__dirname, '../compiled-ionic-angular');


// copy compiler/index.js to the compiled ionic-angular location
const compilerJsScript = path.join(__dirname, '../compiler/index.js');
const compilerDest = path.join(compiledDir, 'compiler/index.js');
fs.copySync(compilerJsScript, compilerDest);
console.log('build-angular core, copy compiler from:', compilerJsScript);
console.log('build-angular core, copy compiler to:', compilerDest);


Promise.resolve().then(() => {
  // find all the source components and compile
  // them into reusable components, and create a manifest.json
  // where all the components can be found, and their styles.
  return compileComponents().then(results => {
    if (ionicDir) {
      copyCoreToIonicAngular(results.files, ionicDir);
    }
  });

}).then(() => {
  // build all of the core files for ionic-angular
  // the core files are what makes up how ionic-core "works"
  return buildBindingCore(transpiledSrcDir, compiledDir, 'core');

});


const ctx = {};


function compileComponents() {
  const config = {
    compilerOptions: {
      outDir: compiledDir,
      module: 'commonjs',
      target: 'es5'
    },
    include: [srcDir],
    exclude: ['node_modules', 'test'],
    debug: true,
    devMode: DEV_MODE,
    watch: WATCH,
    bundles: BUNDLES,
    packages: {
      fs: fs,
      path: path,
      nodeSass: nodeSass,
      rollup: rollup,
      typescript: typescript
    }
  };

  return compiler.compile(config, ctx);
}


function copyCoreToIonicAngular(srcCorePaths: string[], ionicDir: string) {
  console.log(`ionicDir`, ionicDir);

  const destComponents = path.join(ionicDir, 'src/components');
  const destThemes = path.join(ionicDir, 'src/themes');

  srcCorePaths.forEach(srcCorePath => {
    console.log(`srcCorePath`, srcCorePath);
    let parts = srcCorePath.split(path.sep);
    let copyTo: string;

    if (parts[parts.length - 3] === 'components') {
      const componentName = parts[parts.length - 2];
      const isInBundle = BUNDLES.some(b => b.components.some(c => c === `ion-${componentName}`));

      if (isInBundle) {
        copyTo = path.join(destComponents, parts[parts.length - 2], parts[parts.length - 1]);
      }

    } else if (parts[parts.length - 2] === 'themes') {
      copyTo = path.join(destThemes, parts[parts.length - 1]);
    }

    if (copyTo) {
      fs.ensureDirSync(path.dirname(copyTo));

      console.log(`copy from`, srcCorePath, 'to', copyTo);
      fs.copy(srcCorePath, copyTo, err => {
        if (err) {
          console.log(err)
        }
      });
    }

  });
}

