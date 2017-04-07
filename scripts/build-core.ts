/**
 * Build Core:
 * Creates the core JS files, which are static files ready to
 * go, and already come minified and prepackaged with the required polyfills.
 * These are the core files to allow ionic components to work, but they have
 * already been packaged up into static files ready to be reused.
 *
 * In the "bundle" command, a component registry is concatenated to
 * the top of each core js file. The component registry simply includes all
 * of the possible component tags which exist, and nothing more. If that
 * component tag hits the DOM, the core js files figure out how to request
 * the actual component module and styles.
 *
 * There is really only one "core" js, however the various versions
 * available come with ready to go polyfills. When the app first starts, it'll
 * figure out the polyfills required, if any. Static polyfill files are simply
 * concatenated to the top their respective core file.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as babel from 'babel-core';
const rollup = require('rollup');

export const ROOT_DIR = path.join(__dirname, '../..');
export const EXTERNS = path.join(ROOT_DIR, 'scripts', 'core.externs.js');
export const POLYFILLS_DIR = path.join(ROOT_DIR, 'src/polyfills');
export const LICENSE = `/*! (C) Ionic, https://ionicframework.com/ - Mit License */\n`;


function buildCoreDev(ctx: BuildContext) {
  // ionic.core.dev.js - Extends HTMLElement Class, w/out polyfills, not minified

  return rollup.rollup({
    entry: ctx.coreEntryFilePath

  }).then((bundle: any) => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document) {\n"use strict";\n',
      outro: '})(window, document);'
    });

    ctx.coreDevContent = transpile(result.code);
    return writeFile(ctx.coreDevFilePath, ctx.coreDevContent);
  });
}


function buildCoreES5Dev(ctx: BuildContext) {
  // ionic.core.es5.dev.js - HTMLElement Function, w/out polyfills, not minified

  return rollup.rollup({
    entry: ctx.coreES5EntryFilePath

  }).then((bundle: any) => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document) {\n"use strict";\n',
      outro: '})(window, document);'
    });

    ctx.coreES5DevContent = transpile(result.code);
    return writeFile(ctx.coreES5DevFilePath, ctx.coreES5DevContent);
  });
}


function buildCoreES5Minified(ctx: BuildContext) {
  // ionic.core.es5.js - HTMLElement Function, w/out polyfills, is minified

  const ClosureCompiler = require('google-closure-compiler').compiler;

  const opts = {
    js: ctx.coreES5DevFilePath,
    externs: EXTERNS,
    language_out: 'ECMASCRIPT5',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    assume_function_wrapper: 'true',
    warning_level: 'QUIET',
    rewrite_polyfills: 'false',
    // formatting: 'PRETTY_PRINT',
    // debug: 'true'
  };

  return new Promise((resolve, reject) => {
    var closureCompiler = new ClosureCompiler(opts);

    closureCompiler.run((exitCode: number, stdOut: string, stdErr: string) => {
      if (stdErr) {
        console.log('closureCompiler exitCode', exitCode, 'stdErr', stdErr);
        reject(stdErr);

      } else {
        ctx.coreES5MinifiedContent = stdOut

        fs.unlink(ctx.coreES5DevFilePath, () => {
          resolve();
        });
      }
    });
  });
}


function buildCoreMinified(ctx: BuildContext) {
  // ionic.core.js - Extends HTMLElement Class, w/out polyfills, is minified
  var closurePrepareFilePath = ctx.coreMinifiedFilePath.replace('.js', '.closure.js');

  var content = ctx.coreDevContent;

  var match = /class (.*?) extends HTMLElement {}/gm.exec(content);
  if (!match) {
    throw 'preClosure: something done changed!'
  }

  content = content.replace(match[0], 'function ' + match[1] + ' () { "tricks-are-for-closure"; }');

  return writeFile(closurePrepareFilePath, content).then(() => {

    var ClosureCompiler = require('google-closure-compiler').compiler;

    var opts = {
      js: closurePrepareFilePath,
      externs: EXTERNS,
      language_out: 'ECMASCRIPT5',
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      assume_function_wrapper: 'true',
      warning_level: 'QUIET',
      rewrite_polyfills: 'false',
      // formatting: 'PRETTY_PRINT',
      // debug: 'true'
    };

    var closureCompiler = new ClosureCompiler(opts);

    return new Promise((resolve, reject) => {
      closureCompiler.run((exitCode: number, stdOut: string, stdErr: string) => {
        if (stdErr) {
          console.log('closureCompiler exitCode', exitCode, 'stdErr', stdErr);
          reject(stdErr);

        } else {
          var content = stdOut;

          var match = /function (.*?)\(\){"tricks-are-for-closure"}/gm.exec(content);
          if (!match) {
            match = /function (.*?)\s*?\(\)\s*?{\s*?"tricks-are-for-closure";\s*?}/gm.exec(content);
            if (!match) {
              throw 'postClosure: something done changed!'
            }
          }

          var className = match[0].split('(')[0].replace('function ', '').trim();

          if (className.indexOf('$$') > -1) {
            className += '$$'; // thanks JS regex :)
          }

          content = content.replace(match[0], 'class ' + className + ' extends HTMLElement {}');

          // (function(B,U){
          var match = /\(function\((.*?),(.*?)\)\{/.exec(content);
          if (!match) {
            throw 'addUseStrict: something done changed!';
          }

          content = content.replace(match[0], '(function(' + match[1] + ',' + match[2] + '){"use-strict";')

          ctx.coreMinifiedContent = content;

          fs.unlink(closurePrepareFilePath);

          writeFile(ctx.coreMinifiedFilePath, LICENSE + ctx.coreMinifiedContent).then(() => {
            resolve();
          });
        }
      });
    });

  });
}


function customElementPolyfillDev(ctx: BuildContext) {
  const content = [
    ctx.cePolyfillContent,
    LICENSE + ctx.coreES5DevContent
  ];

  return writeFile(ctx.ceDevFilePath, content.join('\n'));
}


function customElementPolyfillMin(ctx: BuildContext) {
  const content = [
    ctx.cePolyfillContent,
    LICENSE + ctx.coreES5MinifiedContent
  ];

  return writeFile(ctx.ceMinFilePath, content.join('\n'));
}


function shadyDomCustomElementPolyfillDev(ctx: BuildContext) {
  const content = [
    ctx.shadyDomContent,
    ctx.cePolyfillContent,
    LICENSE + ctx.coreES5DevContent
  ];

  return writeFile(ctx.sdCeDevFilePath, content.join('\n'));
}


function shadyDomCustomElementPolyfillMin(ctx: BuildContext) {
  const content = [
    ctx.shadyDomContent,
    ctx.cePolyfillContent,
    LICENSE + ctx.coreES5MinifiedContent
  ];

  return writeFile(ctx.sdCeMinFilePath, content.join('\n'));
}


function transpile(code: string) {
  var plugins = [
    'transform-es2015-arrow-functions',
    'transform-es2015-block-scoped-functions',
    'transform-es2015-block-scoping',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-shorthand-properties',
    'transform-es2015-template-literals',
  ];

  const transpileResult = babel.transform(code, { plugins: plugins });

  return transpileResult.code;
}


export function writeFile(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function buildBindingCore(transpiledSrcDir: string, destDir: string) {
  const ctx: BuildContext = {
    coreEntryFilePath: path.join(transpiledSrcDir, 'ionic.core.js'),
    coreDevContent: '',
    coreDevFilePath: path.join(destDir, 'ionic.core.dev.js'),
    coreMinifiedContent: '',
    coreMinifiedFilePath: path.join(destDir, 'ionic.core.js'),
    coreES5EntryFilePath: path.join(transpiledSrcDir, 'ionic.core.es5.js'),
    coreES5DevContent: '',
    coreES5DevFilePath: path.join(destDir, 'ionic.core.es5.dev.js'),
    coreES5MinifiedContent: '',
    coreES5MinifiedFilePath: path.join(destDir, 'ionic.core.es5.js'),
    ceDevFilePath: path.join(destDir, 'ionic.core.ce.dev.js'),
    ceMinFilePath: path.join(destDir, 'ionic.core.ce.js'),
    sdCeDevFilePath: path.join(destDir, 'ionic.core.sd.ce.dev.js'),
    sdCeMinFilePath: path.join(destDir, 'ionic.core.sd.ce.js'),

    shadyDomFilePath: path.join(POLYFILLS_DIR, 'shady-dom.js'),
    shadyDomContent: '',

    cePolyFillPath: path.join(POLYFILLS_DIR, 'document-register-element.js'),
    cePolyfillContent: ''
  };

  return Promise.all([
    buildCoreDev(ctx),
    buildCoreES5Dev(ctx)
  ])

  .then(() => {

    return Promise.all([
      buildCoreMinified(ctx),
      buildCoreES5Minified(ctx)
    ]);

  })

  .then(() => {

    ctx.shadyDomContent = fs.readFileSync(ctx.shadyDomFilePath, 'utf-8').trim();
    ctx.cePolyfillContent = fs.readFileSync(ctx.cePolyFillPath, 'utf-8').trim();

    return Promise.all([
      customElementPolyfillDev(ctx),
      customElementPolyfillMin(ctx),
      shadyDomCustomElementPolyfillDev(ctx),
      shadyDomCustomElementPolyfillMin(ctx)
    ]);

  });
}


interface BuildContext {
  /**
   * Extends HTMLElement Class entry file
   */
  coreEntryFilePath: string;

  /**
   * Extends HTMLElement Class, w/out polyfills, not minified
   */
  coreDevContent: string;

  /**
   * Extends HTMLElement Class, w/out polyfills, not minified
   */
  coreDevFilePath: string;

  /**
   * Extends HTMLElement Class, w/out polyfills, is minified
   */
  coreMinifiedContent: string;

  /**
   * Extends HTMLElement Class, w/out polyfills, is minified
   */
  coreMinifiedFilePath: string;

  /**
   * HTMLElement Function entry file
   */
  coreES5EntryFilePath: string;

  /**
   * HTMLElement Function, w/out polyfills, not minified
   */
  coreES5DevContent: string;

  /**
   * HTMLElement Function, w/out polyfills, not minified
   */
  coreES5DevFilePath: string;

  /**
   * HTMLElement Function, w/out polyfills, is minified
   */
  coreES5MinifiedContent: string;

  /**
   * HTMLElement Function, w/out polyfills, is minified
   */
  coreES5MinifiedFilePath: string;

  /**
   * HTMLElement Function, document-register-element polyfilled, not minified
   */
  ceDevFilePath: string;

  /**
   * HTMLElement Function, document-register-element polyfilled, is minified
   */
  ceMinFilePath: string;

  /**
   * HTMLElement Function, shady dom, document-register-element polyfilled, not minified
   */
  sdCeDevFilePath: string;

  /**
   * HTMLElement Function, shady dom, document-register-element polyfilled, is minified
   */
  sdCeMinFilePath: string;

  shadyDomFilePath: string;
  shadyDomContent: string;

  cePolyFillPath: string;
  cePolyfillContent: string;
};

