/**
 * Build Web:
 * First compiles all of the source Ionic components into reusable
 * ionic components, along with creating a manifest.json of all of
 * ionic's components.
 *
 * Next it'll bundle up all of the compiled components, using the
 * newly created manifest.json as a guide, and create a bunch of
 * bundle js files which include each component.
 *
 * It'll also create "ionic.js", which is the base "loader" file
 * that decides which core file/polyfills it needs. The ionic-angular
 * project doesn't need a "loader" because their's is built within
 * the initial ionic providers during bootstrap.
 */

import { LICENSE, writeFile } from './build-core';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as rollup from 'rollup';
import * as uglify from 'uglify-js';
import * as sass from 'node-sass';

const transpiledSrcDir = path.join(__dirname, '../transpiled-web/bindings/web/src');
const destDir = path.join(__dirname, '../ionic-web');


function buildLoader(transpiledSrcDir: string, destDir: string) {
  const loaderSrcFile = path.join(transpiledSrcDir, 'ionic.js');
  const loaderDevFile = path.join(destDir, 'ionic.dev.js');
  const minifiedFile = path.join(destDir, 'ionic.js');

  fs.copy(loaderSrcFile, loaderDevFile);

  const ClosureCompiler = require('google-closure-compiler').compiler;

  const opts = {
    js: loaderSrcFile,
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

    } else {
      writeFile(minifiedFile, LICENSE + stdOut);
    }
  });
}


function buildComponents(destDir) {
  const srcDir = path.join(__dirname, '../../src');
  const compiler = require(path.join(__dirname, '../ionic-compiler'));

  const compilerConfig = {
    compilerOptions: {
      outDir: destDir
    },
    include: [srcDir],
    exclude: ['node_modules', 'test'],
    debug: true
  };

  return compiler.compile(compilerConfig).then(() => {

    const bundlerConfig = {
      coreDir: destDir,
      buildDir: destDir,
      rollup: rollup,
      uglify: uglify,
      sass: sass,
      minifyJs: false,
      debug: true
    };

    return compiler.bundle(bundlerConfig);

  }).then(results => {
    if (results.errors) {
      results.errors.forEach(err => {
        console.error(`compiler.compile: ${err}`);
      })
    }
  });
}


buildLoader(transpiledSrcDir, destDir);

buildComponents(destDir);
