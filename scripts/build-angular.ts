/**
 * Build Angular:
 * First build the core files for specifically ionic-angular.
 *
 * Bundle up all of the compiled ionic components, using the
 * newly created manifest.json as a guide, and create a bunch of
 * bundled js files which include each component.
 *
 * We do not need to create an ionic.js file because that is
 * apart of Ionic's providers during bootstrap.
 */

import { buildBindingCore } from './build-core';
import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as uglify from 'uglify-js';

// dynamic require cuz this file gets transpiled to dist/
const compiler = require(path.join(__dirname, '../compiler'));


const srcDir = path.join(__dirname, '../../src');
const transpiledSrcDir = path.join(__dirname, '../transpiled-angular/bindings/angular/src');
const destDir = path.join(__dirname, '../ionic-angular');


// first clean out the ionic-web directory
fs.emptyDirSync(destDir);


const ctx = {};

// first find all the source components and compile
// them into reusable components
compileComponents()
  .then(() => {
    // next build all of the core files for ionic-web
    return buildBindingCore(transpiledSrcDir, destDir);
  })
  .then(() => {
    // next add the component registry to the top of each core file
    return bundleComponents(destDir);
  });


function compileComponents() {
  const config = {
    compilerOptions: {
      outDir: destDir,
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


function bundleComponents(destDir: string) {
  const config = {
    coreDir: destDir,
    buildDir: destDir,
    packages: {
      rollup: rollup,
      uglify: uglify,
      nodeSass: nodeSass
    },
    minifyJs: true,
    debug: true
  };

  return compiler.bundle(config, ctx).then(results => {
    if (results.errors) {
      results.errors.forEach(err => {
        console.error(`compiler.bundle: ${err}`);
      });
    }
  });
}
