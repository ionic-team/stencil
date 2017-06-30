/**
 * Build Core:
 * Creates the core JS files, which are static files ready to
 * go, and already come minified and prepackaged with the required polyfills.
 * These are the core files to allow stencil components to work, but they have
 * already been packaged up into static files ready to be reused.
 */

const babel = require('babel-core');
const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');


const ROOT_DIR = path.join(__dirname, '../');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const EXTERNS_CORE = path.join(ROOT_DIR, 'scripts', 'externs.core.js');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-core');
const BINDINGS_DIR = path.join(TRANSPILED_DIR, 'bindings');
const BINDINGS_CLIENT_DIR = path.join(BINDINGS_DIR, 'client');
const DIST_CLIENT_DIR = path.join(DIST_DIR, 'client');

const CLIENT_CORE_ENTRY_FILE = path.join(BINDINGS_CLIENT_DIR, 'core.js');
const CLIENT_CORE_ES5_ENTRY_FILE = path.join(BINDINGS_CLIENT_DIR, 'core.es5.js');

const DIST_CLIENT_DEV_FILE = path.join(DIST_CLIENT_DIR, 'core.dev.js');
const DIST_CLIENT_PROD_FILE = path.join(DIST_CLIENT_DIR, 'core.js');

const DIST_CLIENT_ES5_DEV_FILE = path.join(DIST_CLIENT_DIR, 'core.es5.dev.js');
const DIST_CLIENT_ES5_PROD_FILE = path.join(DIST_CLIENT_DIR, 'core.es5.js');

const CLIENT_LOADER_ENTRY_FILE = path.join(BINDINGS_CLIENT_DIR, 'loader.js');
const DIST_CLIENT_LOADER_DEV_FILE = path.join(DIST_CLIENT_DIR, 'loader.dev.js');
const DIST_CLIENT_LOADER_PROD_FILE = path.join(DIST_CLIENT_DIR, 'loader.js');

const STENCIL_GLOBAL_NAMESPACE = '__STENCIL__APP__';


fs.ensureDirSync(DIST_CLIENT_DIR);


function buildCore(isDevMode) {
  bundleClientCore(
    CLIENT_CORE_ENTRY_FILE,
    DIST_CLIENT_DEV_FILE,
    DIST_CLIENT_PROD_FILE,
    true,
    false,
    isDevMode
  );

  if (!isDevMode) {
    bundleClientCore(
      CLIENT_CORE_ES5_ENTRY_FILE,
      DIST_CLIENT_ES5_DEV_FILE,
      DIST_CLIENT_ES5_PROD_FILE,
      false,
      true,
      isDevMode
    );
  }

  buildLoader(
    CLIENT_LOADER_ENTRY_FILE,
    DIST_CLIENT_LOADER_DEV_FILE,
    DIST_CLIENT_LOADER_PROD_FILE,
    isDevMode
  );
}


function bundleClientCore(coreEntryFile, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode) {
  rollup.rollup({
    entry: coreEntryFile
  })
  .then((bundle) => {
    generateClientCoreDev(bundle, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode);
  })
  .catch(err => {
    console.log(err);
    console.log(err.stack);
  });
}


function generateClientCoreDev(bundle, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode) {
  var clientCore = bundle.generate({
    format: 'es',
    intro: '(function(window, document, globalNamespace) {\n"use strict";\n',
    outro: '})(window, document, "' + STENCIL_GLOBAL_NAMESPACE + '");'
  });

  var devCode = clientCore.code;

  devCode = transpile(devCode);

  if (es5) {
    // uber transpile hack so we can do without the polyfill runtimes
    devCode = devCode.replace(/class VNode \{\}/g, 'var VNode = function VNode() {}');
  }

  fs.writeFile(outputDevFile, devCode, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('built dev:', outputDevFile);
    }
  });

  if (!isDevMode) {
    generateClientCoreProd(devCode, outputDevFile, outputProdFile, es6ClassHack)
  }
}


function generateClientCoreProd(devCode, outputDevFile, outputProdFile, es6ClassHack) {

  if (es6ClassHack) {
    var closurePreparedFilePath = outputDevFile.replace('.js', '.closure.js');

    var match = /class HostElement extends HTMLElement {}/.exec(devCode);
    if (!match) {
      fs.writeFileSync(closurePreparedFilePath, devCode);
      throw 'preClosure: something done changed!'
    }

    devCode = devCode.replace(match[0], 'function(){"tricks-are-for-closure"}');

    fs.writeFile(closurePreparedFilePath, devCode, (err) => {
      if (err) {
        throw err;
      }
      runClosure(closurePreparedFilePath, outputProdFile, es6ClassHack);
    });

  } else {
    runClosure(outputDevFile, outputProdFile, es6ClassHack);
  }
}


function runClosure(inputFile, outputProdFile, es6ClassHack) {
  var ClosureCompiler = require('google-closure-compiler').compiler;

  var opts = {
    js: inputFile,
    externs: EXTERNS_CORE,
    language_out: 'ECMASCRIPT5',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    assume_function_wrapper: 'true',
    warning_level: 'QUIET',
    rewrite_polyfills: 'false',
    // formatting: 'PRETTY_PRINT',
    // debug: 'true'
  };

  var closureCompiler = new ClosureCompiler(opts);

  closureCompiler.run((exitCode, prodCode, stdErr) => {
    if (stdErr) {
      console.log('core, closureCompiler exitCode', exitCode, 'stdErr', stdErr);
      throw stdErr;
    }

    if (es6ClassHack) {
      var match = /function\(\){"tricks-are-for-closure"}/.exec(prodCode);
      if (!match) {
        fs.writeFileSync(inputFile, prodCode);
        throw 'postClosure: something done changed!'
      }

      prodCode = prodCode.replace(match[0], `class extends HTMLElement{}`);

      fs.unlink(inputFile);
    }

    // (function(B,U){
    var match = /\(function\((.*?)\)\{/.exec(prodCode);
    if (!match) {
      match = /\(function\((.*?)\)\ {/.exec(prodCode);
      if (!match) {
        console.log(prodCode);
        throw 'addUseStrict: something done changed!';
      }
    }

    prodCode = prodCode.replace(match[0], '(function(' + match[1] + '){"use-strict";')

    fs.writeFile(outputProdFile, prodCode, (err) => {
      if (err) {
        throw err;
      }

      console.log('built prod:', outputProdFile);
    });
  });
}


function buildLoader(loaderEntryFile, outputDevFile, outputProdFile, isDevMode) {

  fs.readFile(loaderEntryFile, 'utf-8', (err, devCode) => {
    if (err) {
      throw err;
    }

    devCode = transpile(devCode);

    fs.writeFile(outputDevFile, devCode, (err) => {
      if (err) {
        throw err;
      }

      console.log('built dev:', outputDevFile);

      if (!isDevMode) {
        runClosure(outputDevFile, outputProdFile, false);
      }
    });
  });
}


function transpile(code) {
  var plugins = [
    'transform-es2015-arrow-functions',
    'transform-es2015-block-scoped-functions',
    'transform-es2015-block-scoping',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-shorthand-properties',
    'transform-es2015-template-literals',
  ];

  plugins = plugins.map(pluginName => path.join(__dirname, `../node_modules/babel-plugin-${pluginName}`));

  const transpileResult = babel.transform(code, { plugins: plugins });

  return transpileResult.code;
}



if (process.argv.indexOf('dev') > -1) {
  console.log('building core dev...');
  buildCore(true);

} else {
  console.log('building core...');
  buildCore(false);
}


process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
