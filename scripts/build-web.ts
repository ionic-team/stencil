/**
 * Build Web:
 * First build the core files for specifically ionic-web, and
 * create manifest.json with all meta data about each component.
 *
 * Bundle up all of the compiled ionic components, using the
 * newly created manifest.json as a guide, and create a bunch of
 * bundled js files which include each component.
 *
 * It'll also create "ionic.js", which is the base "loader" file
 * that decides which core file/polyfills it needs. The ionic-angular
 * project doesn't need a "loader" because it's built within
 * the initial ionic providers during bootstrap.
 */

import { buildBindingCore, LICENSE, readFile, writeFile } from './build-core';
import * as fs from 'fs-extra';
import * as nodeSass from 'node-sass';
import * as path from 'path';
import * as rollup from 'rollup';
import * as uglify from 'uglify-js';

// dynamic require cuz this file gets transpiled to dist/
const compiler = require(path.join(__dirname, '../compiler'));


const srcDir = path.join(__dirname, '../../src');
const transpiledSrcDir = path.join(__dirname, '../transpiled-web/bindings/web/src');
const compiledDir = path.join(__dirname, '../compiled-ionic-web');
const destDir = path.join(__dirname, '../ionic-web');


// first clean out the ionic-web directories
fs.emptyDirSync(destDir);
fs.emptyDirSync(compiledDir);


const ctx = {};

// find all the source components and compile
// them into reusable components, and create a manifest.json
// where all the components can be found, and their styles.
compileComponents()
  .then(() => {
    // next build all of the core files for ionic-web
    return buildBindingCore(transpiledSrcDir, compiledDir, 'core');

  }).then(() => {
    // next add the component registry to the top of each core file
    return bundleComponents();

  }).then(() => {
    // next build the ionic.js loader file which
    // ionic-web uses to decide which core files to load
    return buildLoader();

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
      fs: fs,
      path: path,
      nodeSass: nodeSass
    }
  };

  return compiler.compile(config, ctx);
}


function bundleComponents() {
  const config = {
    srcDir: compiledDir,
    destDir: destDir,
    packages: {
      rollup: rollup,
      uglify: uglify,
      nodeSass: nodeSass
    },
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


function buildLoader() {
  const loaderSrcFile = path.join(transpiledSrcDir, 'ionic.js');
  const devLoaderPath = path.join(destDir, 'ionic.dev.js');
  const prodLoaderPath = path.join(destDir, 'ionic.js');

  return readFile(loaderSrcFile).then(srcLoaderJs => {
    writeFile(devLoaderPath, srcLoaderJs);

    return writeFile(prodLoaderPath, srcLoaderJs).then(() => {
      const ClosureCompiler = require('google-closure-compiler').compiler;

      return new Promise((resolve, reject) => {
        const opts = {
          js: prodLoaderPath,
          language_out: 'ECMASCRIPT5',
          warning_level: 'QUIET',
          rewrite_polyfills: 'false',
          // formatting: 'PRETTY_PRINT',
          // debug: 'true'
        };

        var closureCompiler = new ClosureCompiler(opts);

        closureCompiler.run((exitCode: number, stdOut: string, stdErr: string) => {
          if (stdErr) {
            console.log('buildLoader closureCompiler, exitCode', exitCode, 'stdErr', stdErr);
            reject();

          } else {
            writeFile(prodLoaderPath, LICENSE + stdOut).then(() => {
              resolve();
            });
          }
        });
      });
    });
  });
}
