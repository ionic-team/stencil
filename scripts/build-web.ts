import { buildCore, writeFile, LICENSE } from './build-core';
import * as path from 'path';
import * as fs from 'fs-extra';


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

buildCore(transpiledSrcDir, destDir);

buildLoader(transpiledSrcDir, destDir);
