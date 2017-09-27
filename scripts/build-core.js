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
const SRC_DIR = path.join(ROOT_DIR, 'src');
const EXTERNS_CORE = path.join(ROOT_DIR, 'scripts', 'externs.core.js');
const TRANSPILED_DIR = path.join(DIST_DIR, 'transpiled-core');
const SRC_CLIENT_DIR = path.join(TRANSPILED_DIR, 'client');
const DIST_CLIENT_DIR = path.join(DIST_DIR, 'client');
const POLYFILLS_SRC_DIR = path.join(ROOT_DIR, 'scripts', 'polyfills');
const POLYFILLS_DIST_DIR = path.join(DIST_DIR, 'client', 'polyfills');

const CLIENT_CORE_ENTRY_FILE = path.join(SRC_CLIENT_DIR, 'core.js');
const CLIENT_CORE_ES5_ENTRY_FILE = path.join(SRC_CLIENT_DIR, 'core.es5.js');

const DIST_CLIENT_DEV_FILE = path.join(DIST_CLIENT_DIR, 'core.dev.js');
const DIST_CLIENT_PROD_FILE = path.join(DIST_CLIENT_DIR, 'core.js');

const DIST_CLIENT_ES5_DEV_FILE = path.join(DIST_CLIENT_DIR, 'core.es5.dev.js');
const DIST_CLIENT_ES5_PROD_FILE = path.join(DIST_CLIENT_DIR, 'core.es5.js');

const CLIENT_LOADER_ENTRY_FILE = path.join(SRC_CLIENT_DIR, 'loader.js');
const DIST_CLIENT_LOADER_DEV_FILE = path.join(DIST_CLIENT_DIR, 'loader.dev.js');
const DIST_CLIENT_LOADER_PROD_FILE = path.join(DIST_CLIENT_DIR, 'loader.js');


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

  copyPolyfills(POLYFILLS_SRC_DIR, POLYFILLS_DIST_DIR);

  copyUtilFiles();
}


function bundleClientCore(coreEntryFile, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode) {
  rollup.rollup({
    entry: coreEntryFile
  })
  .then((bundle) => {
    return generateClientCoreDev(bundle, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode);
  })
  .catch(err => {
    console.log(err);
    console.log(err.stack);
  });
}


function generateClientCoreDev(bundle, outputDevFile, outputProdFile, es6ClassHack, es5, isDevMode) {
  return bundle.generate({
    format: 'es',
    intro: '(function(window, document, Context, appNamespace, publicPath) {\n"use strict";\n',
    outro: '})(window, document, Context, appNamespace, publicPath);'

  }).then(clientCore => {
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
  });
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


function copyPolyfills(polyfillsSrcDir, polyfillsDestDir) {
  fs.copy(polyfillsSrcDir, polyfillsDestDir);
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

function copyUtilFiles() {
  copyMainIndex();
  copyMainDTs();
  copyUtilDir();
}

function copyMainDTs() {
  const readMainDTsPath = path.join(TRANSPILED_DIR, 'index.d.ts');
  const writeMainDTsPath = path.join(DIST_DIR, 'index.d.ts');
  fs.readFile(readMainDTsPath, function(err, data) {
    if (err) {
      console.log('Failed to read: ', readMainDTsPath);
      return process.exit(1);
    }
    fs.writeFile(writeMainDTsPath, data.toString(), function(err) {
      if (err) {
        console.log('Failed to write: ', writeMainDTsPath);
        return process.exit(1);
      }
    });
  });
}

function copyMainIndex() {
  const srcIndexPath = path.join(SRC_DIR, 'index.js');
  const destIndexPath = path.join(DIST_DIR, 'index.js');
  fs.copy(srcIndexPath, destIndexPath, (err) => {
    if (err) {
      console.log('Failed to write: ', destIndexPath);
      return process.exit(1);
    }
  });

}

function copyUtilDir() {
  const readUtilDirPath = path.join(TRANSPILED_DIR, 'util');
  const writeUtilDirPath = path.join(DIST_DIR, 'util');
  fs.ensureDirSync(writeUtilDirPath);
  fs.readdir(readUtilDirPath, function(err, fileNames) {
    if (err) {
      console.log('failed to read dir: ', readUtilDirPath);
      return process.exit(1);
    }
    fileNames = fileNames.filter(function(fileName) {
      return fileName.endsWith('.d.ts');
    }).map(function(fileName) {
      return path.join(readUtilDirPath, fileName);
    }).forEach(function(fullPath) {
      const writePath = path.join(writeUtilDirPath, path.basename(fullPath));
      fs.copy(fullPath, writePath, function(err) {
        if (err) {
          console.log(`failed to copy ${fullPath} to ${writePath}: `, err.message);
          process.exit(1);
        }
      });
    });

  })
}

process.on('exit', (code) => {
  fs.removeSync(TRANSPILED_DIR);
});
