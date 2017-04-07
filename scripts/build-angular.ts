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

// dynamic require cuz this file gets transpiled to dist/
const compiler = require(path.join(__dirname, '../compiler'));


const srcDir = path.join(__dirname, '../../src');
const transpiledSrcDir = path.join(__dirname, '../transpiled-angular/bindings/angular/src');
const compiledDir = path.join(__dirname, '../compiled-ionic-angular');


// first clean out the ionic-web directories
fs.emptyDirSync(compiledDir);

// copy compiler/index.js to the compiled ionic-angular location
const compilerJsScript = path.join(__dirname, '../compiler/index.js');
const compilerDest = path.join(compiledDir, 'compiler/index.js');
fs.copySync(compilerJsScript, compilerDest);


const ctx = {};

// find all the source components and compile
// them into reusable components, and create a manifest.json
// where all the components can be found, and their styles.
compileComponents()
  .then(() => {
    // next build all of the core files for ionic-angular
    return buildBindingCore(transpiledSrcDir, compiledDir, 'core');

  }).catch(err => {
    console.log(err);
  });


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
      ['ion-badge']
    ],
    packages: {
      nodeSass: nodeSass
    }
  };

  return compiler.compile(config, ctx);
}
