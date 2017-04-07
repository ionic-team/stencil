/**
 * Build Web:
 * First build the core files for specifically ionic-web.
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
const destDir = path.join(__dirname, '../ionic-web');


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
  })
  .then(() => {
    // next build the ionic.js loader file which
    // ionic-web uses to decide which core files to load
    return buildLoader(transpiledSrcDir, destDir);
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


function buildLoader(transpiledSrcDir: string, destDir: string) {
  const loaderSrcFile = path.join(transpiledSrcDir, 'ionic.js');
  const loaderDevFile = path.join(destDir, 'ionic.dev.js');
  const minifiedFile = path.join(destDir, 'ionic.js');

  return readFile(loaderSrcFile).then(srcLoaderJs => {
    const prodModeLoaderJs = srcLoaderJs.replace('$IONIC_DEV_MODE', 'false');
    const devModeLoaderJs = srcLoaderJs.replace('$IONIC_DEV_MODE', 'true');

    writeFile(loaderDevFile, devModeLoaderJs);

    return writeFile(minifiedFile, prodModeLoaderJs).then(() => {
      const ClosureCompiler = require('google-closure-compiler').compiler;

      return new Promise((resolve, reject) => {
        const opts = {
          js: minifiedFile,
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
            writeFile(minifiedFile, LICENSE + stdOut).then(() => {
              resolve();
            });
          }
        });
      });
    });
  });
}
