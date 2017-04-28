/**
 * Build Angular:
 * Build the core files for ionic-angular. We do not need
 * to create an ionic.js file because that is apart of
 * Ionic's providers during bootstrap. We also do not need
 * to bundle files because that will be done during a
 * user's build from within app-scripts.
 */

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
let skipBuildingCore = false;

if (process.argv[2]) {
  srcDir = process.argv[2];
}
console.log('build-angular core, srcDir:', srcDir);

if (process.argv[3]) {
  compiledDir = process.argv[3];
}
console.log('build-angular core, compiledDir:', srcDir);


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
  return compileComponents();

}).then(() => {
  // build all of the core files for ionic-angular
  // the core files are what makes up how ionic-core "works"
  return buildBindingCore(transpiledSrcDir, compiledDir, 'core', skipBuildingCore);
})


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
    bundles: [
      ['ion-badge'],
      ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'],
      ['ion-gesture'],
      ['ion-toggle']
    ],
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
