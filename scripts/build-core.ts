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
import * as ts from 'typescript';
const rollup = require('rollup');

export const ROOT_DIR = path.join(__dirname, '../..');
export const EXTERNS_CORE = path.join(ROOT_DIR, 'scripts', 'externs.core.js');
export const EXTERNS_ANIMATION = path.join(ROOT_DIR, 'scripts', 'externs.animation.js');
export const POLYFILLS_DIR = path.join(ROOT_DIR, 'src/polyfills');
export const LICENSE = `/*! (C) Ionic https://ionicframework.com - MIT License */`;


function buildCore(ctx: BuildContext) {
  // ionic.core.dev.js - Extends HTMLElement Class, w/out polyfills, not minified

  return rollup.rollup({
    entry: ctx.coreEntryFilePath

  }).then((bundle: any) => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window) {\n"use strict";\n',
      outro: '})(window);'
    });

    ctx.coreDevContent = transpile(result.code);

    ts.sys.writeFile(ctx.coreDevFilePath, ctx.coreDevContent);

    console.log('core, buildCore:', ctx.coreDevFilePath);

    return Promise.resolve();
  });
}


function buildCoreES5(ctx: BuildContext) {
  // ionic.core.es5.dev.js - HTMLElement Function, w/out polyfills, not minified

  return rollup.rollup({
    entry: ctx.coreES5EntryFilePath

  }).then((bundle: any) => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window) {\n"use strict";\n',
      outro: '})(window);'
    });

    ctx.coreES5DevContent = transpile(result.code);

    ts.sys.writeFile(ctx.coreES5DevFilePath, ctx.coreES5DevContent);

    console.log('core, buildCoreES5:', ctx.coreES5DevFilePath);

    return Promise.resolve();
  });
}


function buildCoreES5Minified(ctx: BuildContext) {
  // ionic.core.es5.js - HTMLElement Function, w/out polyfills, is minified

  const ClosureCompiler = require('google-closure-compiler').compiler;

  const opts = {
    js: ctx.coreES5DevFilePath,
    externs: EXTERNS_CORE,
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
        console.log('core, closureCompiler exitCode', exitCode, 'stdErr', stdErr);
        reject(stdErr);

      } else {
        ctx.coreES5MinifiedContent = stdOut;

        fs.unlink(ctx.coreES5DevFilePath, () => {
          console.log('core, buildCoreES5Minified:', ctx.coreES5DevFilePath);

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

    return new Promise((resolve, reject) => {
      closureCompiler.run((exitCode: number, stdOut: string, stdErr: string) => {
        if (stdErr) {
          console.log('core, closureCompiler exitCode', exitCode, 'stdErr', stdErr);
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
          var match = /\(function\((.*?)\)\{/.exec(content);
          if (!match) {
            match = /\(function\((.*?)\)\ {/.exec(content);
            if (!match) {
              console.log(content);
              throw 'addUseStrict: something done changed!';
            }
          }

          content = content.replace(match[0], '(function(' + match[1] + '){"use-strict";')

          ctx.coreMinifiedContent = content;

          fs.unlink(closurePrepareFilePath);

          writeFile(ctx.coreMinifiedFilePath, `${LICENSE}\n${ctx.coreMinifiedContent}`).then(() => {
            console.log('core, buildCoreMinified:', ctx.coreMinifiedFilePath);

            resolve();
          });
        }
      });
    });

  });
}


function buildAnimation(ctx: BuildContext) {
  // ionic.animation.dev.js

  return rollup.rollup({
    entry: ctx.animationEntryFilePath

  }).then((bundle: any) => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window) {\n"use strict";\n',
      outro: '})(window);'
    });

    ts.sys.writeFile(ctx.animationDevFilePath, result.code);

    return Promise.resolve();
  });
}


function buildAnimationMinified(ctx: BuildContext) {
  // ionic.animation.js

  const ClosureCompiler = require('google-closure-compiler').compiler;

  const opts = {
    js: ctx.animationDevFilePath,
    externs: EXTERNS_ANIMATION,
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
        console.log('core, buildAnimationsMinified exitCode', exitCode, 'stdErr', stdErr);
        reject(stdErr);

      } else {
        const code = `${LICENSE}\n${stdOut}`;

        ts.sys.writeFile(ctx.animationMinifiedFilePath, code);

        fs.unlink(ctx.animationDevFilePath, () => {
          console.log('core, buildAnimationsMinified:', ctx.coreES5DevFilePath);

          resolve();
        });
      }
    });
  });
}


function customElementPolyfillDev(ctx: BuildContext) {
  const content = [
    ctx.cePolyfillContent,
    LICENSE,
    ctx.coreES5DevContent
  ];

  console.log('core, customElementPolyfillDev:', ctx.ceDevFilePath);

  return writeFile(ctx.ceDevFilePath, content.join('\n'));
}


function customElementPolyfillMin(ctx: BuildContext) {
  const content = [
    ctx.cePolyfillContent,
    LICENSE,
    ctx.coreES5MinifiedContent
  ];

  console.log('core, customElementPolyfillMin:', ctx.ceMinFilePath);

  return writeFile(ctx.ceMinFilePath, content.join('\n'));
}


function shadyDomCustomElementPolyfillDev(ctx: BuildContext) {
  const content = [
    ctx.shadyDomContent,
    ctx.cePolyfillContent,
    LICENSE,
    ctx.coreES5DevContent
  ];

  console.log('core, shadyDomCustomElementPolyfillDev:', ctx.sdCeDevFilePath);

  return writeFile(ctx.sdCeDevFilePath, content.join('\n'));
}


function shadyDomCustomElementPolyfillMin(ctx: BuildContext) {
  const content = [
    ctx.shadyDomContent,
    ctx.cePolyfillContent,
    LICENSE,
    ctx.coreES5MinifiedContent
  ];

  console.log('core, shadyDomCustomElementPolyfillMin:', ctx.sdCeMinFilePath);

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


export function readFile(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function buildBindingCore(srcDir: string, destDir: string, coreFilesDir: string, devMode: boolean) {
  console.log('core, buildBindingCore:', srcDir);

  const ctx: BuildContext = {
    coreEntryFilePath: path.join(srcDir, 'ionic.core.js'),
    coreDevContent: '',
    coreDevFilePath: path.join(destDir, coreFilesDir, 'ionic.core.dev.js'),
    coreMinifiedContent: '',
    coreMinifiedFilePath: path.join(destDir, coreFilesDir, 'ionic.core.js'),
    coreES5EntryFilePath: path.join(srcDir, 'ionic.core.es5.js'),
    coreES5DevContent: '',
    coreES5DevFilePath: path.join(destDir, coreFilesDir, 'ionic.core.es5.dev.js'),
    coreES5MinifiedContent: '',
    coreES5MinifiedFilePath: path.join(destDir, coreFilesDir, 'ionic.core.es5.js'),
    ceDevFilePath: path.join(destDir, coreFilesDir, 'ionic.core.ce.dev.js'),
    ceMinFilePath: path.join(destDir, coreFilesDir, 'ionic.core.ce.js'),
    sdCeDevFilePath: path.join(destDir, coreFilesDir, 'ionic.core.sd.ce.dev.js'),
    sdCeMinFilePath: path.join(destDir, coreFilesDir, 'ionic.core.sd.ce.js'),

    shadyDomFilePath: path.join(POLYFILLS_DIR, 'shady-dom.js'),
    shadyDomContent: '',

    cePolyFillPath: path.join(POLYFILLS_DIR, 'document-register-element.js'),
    cePolyfillContent: '',

    animationEntryFilePath: path.join(srcDir, 'ionic.animation.js'),
    animationDevFilePath: path.join(destDir, coreFilesDir, 'ionic.animation.dev.js'),
    animationMinifiedFilePath: path.join(destDir, coreFilesDir, 'ionic.animation.js'),

    devMode: devMode
  };

  // create the dev mode versions
  return Promise.all([
    buildCore(ctx),
    buildCoreES5(ctx),
    buildAnimation(ctx)
  ])

  .then(() => {
    // create the minified versions
    if (!ctx.devMode) {
      return Promise.all([
        buildCoreMinified(ctx),
        buildCoreES5Minified(ctx),
        buildAnimationMinified(ctx)
      ]);
    }

  })

  .then(() => {
    // create the polyfill versions
    ctx.shadyDomContent = fs.readFileSync(ctx.shadyDomFilePath, 'utf-8').trim();
    ctx.cePolyfillContent = fs.readFileSync(ctx.cePolyFillPath, 'utf-8').trim();

    const promises: Promise<any>[] = [
      customElementPolyfillDev(ctx),
      shadyDomCustomElementPolyfillDev(ctx)
    ];

    if (!ctx.devMode) {
      promises.push(customElementPolyfillMin(ctx));
      promises.push(shadyDomCustomElementPolyfillMin(ctx));
    }

    return Promise.all(promises);
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

  animationEntryFilePath: string;
  animationDevFilePath: string;
  animationMinifiedFilePath: string;

  devMode: boolean;
};



// Basic Usage:
//  --compilation_level (-O) VAL           : Specifies the compilation level to
//                                           use. Options: WHITESPACE_ONLY,
//                                           SIMPLE, ADVANCED (default: SIMPLE)
//  --env [BROWSER | CUSTOM]               : Determines the set of builtin externs
//                                           to load. Options: BROWSER, CUSTOM.
//                                           Defaults to BROWSER. (default:
//                                           BROWSER)
//  --externs VAL                          : The file containing JavaScript
//                                           externs. You may specify multiple
//  --js VAL                               : The JavaScript filename. You may
//                                           specify multiple. The flag name is
//                                           optional, because args are
//                                           interpreted as files by default. You
//                                           may also use minimatch-style glob
//                                           patterns. For example, use
//                                           --js='**.js' --js='!**_test.js' to
//                                           recursively include all js files that
//                                           do not end in _test.js
//  --js_output_file VAL                   : Primary output filename. If not
//                                           specified, output is written to
//                                           stdout (default: )
//  --language_in VAL                      : Sets what language spec that input
//                                           sources conform. Options:
//                                           ECMASCRIPT3, ECMASCRIPT5,
//                                           ECMASCRIPT5_STRICT, ECMASCRIPT6
//                                           (default), ECMASCRIPT6_STRICT,
//                                           ECMASCRIPT6_TYPED (experimental)
//                                           (default: ECMASCRIPT6)
//  --language_out VAL                     : Sets what language spec the output
//                                           should conform to. Options:
//                                           ECMASCRIPT3 (default), ECMASCRIPT5,
//                                           ECMASCRIPT5_STRICT, ECMASCRIPT6_TYPED
//                                           (experimental) (default: ECMASCRIPT3)
//  --warning_level (-W) [QUIET | DEFAULT  : Specifies the warning level to use.
//  | VERBOSE]                               Options: QUIET, DEFAULT, VERBOSE
//                                           (default: DEFAULT)


// Warning and Error Management:
//  --conformance_configs VAL              : A list of JS Conformance
//                                           configurations in text protocol
//                                           buffer format.
//  --extra_annotation_name VAL            : A whitelist of tag names in JSDoc.
//                                           You may specify multiple
//  --hide_warnings_for VAL                : If specified, files whose path
//                                           contains this string will have their
//                                           warnings hidden. You may specify
//                                           multiple.
//  --jscomp_error VAL                     : Make the named class of warnings an
//                                           error. Must be one of the error group
//                                           items. '*' adds all supported.
//  --jscomp_off VAL                       : Turn off the named class of warnings.
//                                           Must be one of the error group items.
//                                           '*' adds all supported.
//  --jscomp_warning VAL                   : Make the named class of warnings a
//                                           normal warning. Must be one of the
//                                           error group items. '*' adds all
//                                           supported.
//  --new_type_inf                         : Checks for type errors using the new
//                                           type inference algorithm. (default:
//                                           false)
//  --warnings_whitelist_file VAL          : A file containing warnings to
//                                           suppress. Each line should be of the
//                                           form
//                                           <file-name>:<line-number>?
//                                           <warning-description> (default: )

// Available Error Groups: accessControls, ambiguousFunctionDecl,
//     checkEventfulObjectDisposal, checkRegExp, checkTypes, checkVars,
//     commonJsModuleLoad, conformanceViolations, const, constantProperty,
//     deprecated, deprecatedAnnotations, duplicateMessage, es3, es5Strict,
//     externsValidation, fileoverviewTags, functionParams, globalThis,
//     internetExplorerChecks, invalidCasts, misplacedTypeAnnotation,
//     missingGetCssName, missingOverride, missingPolyfill, missingProperties,
//     missingProvide, missingRequire, missingReturn, msgDescriptions,
//     newCheckTypes, nonStandardJsDocs, reportUnknownTypes, suspiciousCode,
//     strictModuleDepCheck, typeInvalidation, undefinedNames, undefinedVars,
//     unknownDefines, unusedLocalVariables, unusedPrivateMembers, uselessCode,
//     useOfGoogBase, underscore, visibility

// Output:
//  --assume_function_wrapper              : Enable additional optimizations based
//                                           on the assumption that the output
//                                           will be wrapped with a function
//                                           wrapper.  This flag is used to
//                                           indicate that "global" declarations
//                                           will not actually be global but
//                                           instead isolated to the compilation
//                                           unit. This enables additional
//                                           optimizations. (default: false)
//  --export_local_property_definitions    : Generates export code for local
//                                           properties marked with @export
//                                           (default: false)
//  --formatting [PRETTY_PRINT |           : Specifies which formatting options,
//  PRINT_INPUT_DELIMITER | SINGLE_QUOTES]   if any, should be applied to the
//                                           output JS. Options: PRETTY_PRINT,
//                                           PRINT_INPUT_DELIMITER, SINGLE_QUOTES
//  --generate_exports                     : Generates export code for those
//                                           marked with @export (default: false)
//  --isolation_mode [NONE | IIFE]         : If set to IIFE the compiler output
//                                           will follow the form:
//                                             (function(){%output%)).call(this);
//                                           Options: NONE, IIFE (default: NONE)
//  --output_wrapper VAL                   : Interpolate output into this string
//                                           at the place denoted by the marker
//                                           token %output%. Use marker token
//                                           %output|jsstring% to do js string
//                                           escaping on the output. Consider
//                                           using the --isolation_mode flag
//                                           instead. (default: )
//  --output_wrapper_file VAL              : Loads the specified file and passes
//                                           the file contents to the
//                                           --output_wrapper flag, replacing the
//                                           value if it exists. This is useful if
//                                           you want special characters like
//                                           newline in the wrapper. (default: )


// Dependency Management:
//  --dependency_mode [NONE | LOOSE |      : Specifies how the compiler should
//  STRICT]                                  determine the set and order of files
//                                           for a compilation. Options: NONE the
//                                           compiler will include all src files
//                                           in the order listed, STRICT files
//                                           will be included and sorted by
//                                           starting from namespaces or files
//                                           listed by the --entry_point flag -
//                                           files will only be included if they
//                                           are referenced by a goog.require or
//                                           CommonJS require or ES6 import, LOOSE
//                                           same as with STRICT but files which
//                                           do not goog.provide a namespace and
//                                           are not modules will be automatically
//                                           added as --entry_point entries.
//                                           Defaults to NONE. (default: NONE)
//  --entry_point VAL                      : A file or namespace to use as the
//                                           starting point for determining which
//                                           src files to include in the
//                                           compilation. ES6 and CommonJS modules
//                                           are specified as file paths (without
//                                           the extension). Closure-library
//                                           namespaces are specified with a
//                                           "goog:" prefix. Example:
//                                           --entry_point=goog:goog.Promise


// JS Modules:
//  --js_module_root VAL                   : Path prefixes to be removed from ES6
//                                           & CommonJS modules.
//  --module_resolution [BROWSER | LEGACY  : Specifies how the compiler locates
//  | NODE]                                  modules. BROWSER requires all module
//                                           imports to begin with a '.' or '/'
//                                           and have a file extension. NODE uses
//                                           the node module rules. LEGACY
//                                           prepends a '/' to any import not
//                                           already beginning with a '.' or '/'.
//                                           (default: LEGACY)
//  --process_common_js_modules            : Process CommonJS modules to a
//                                           concatenable form. (default: false)
//  --transform_amd_modules                : Transform AMD to CommonJS modules.
//                                           (default: false)


// Library and Framework Specific:
//  --angular_pass                         : Generate $inject properties for
//                                           AngularJS for functions annotated
//                                           with @ngInject (default: false)
//  --dart_pass                            : Rewrite Dart Dev Compiler output to
//                                           be compiler-friendly. (default: false)
//  --polymer_pass                         : Equivalent to --polymer_version=1
//                                           (default: false)
//  --process_closure_primitives           : Processes built-ins from the Closure
//                                           library, such as goog.require(),
//                                           goog.provide(), and goog.exportSymbol(
//                                           ). True by default. (default: true)
//  --rewrite_polyfills                    : Rewrite ES6 library calls to use
//                                           polyfills provided by the compiler's
//                                           runtime. (default: true)


// Code Splitting:
//  --module VAL                           : A JavaScript module specification.
//                                           The format is <name>:<num-js-files>[:[
//                                           <dep>,...][:]]]. Module names must be
//                                           unique. Each dep is the name of a
//                                           module that this module depends on.
//                                           Modules must be listed in dependency
//                                           order, and JS source files must be
//                                           listed in the corresponding order.
//                                           Where --module flags occur in
//                                           relation to --js flags is
//                                           unimportant. <num-js-files> may be
//                                           set to 'auto' for the first module if
//                                           it has no dependencies. Provide the
//                                           value 'auto' to trigger module
//                                           creation from CommonJSmodules.
//  --module_output_path_prefix VAL        : Prefix for filenames of compiled JS
//                                           modules. <module-name>.js will be
//                                           appended to this prefix. Directories
//                                           will be created as needed. Use with
//                                           --module (default: ./)
//  --module_wrapper VAL                   : An output wrapper for a JavaScript
//                                           module (optional). The format is
//                                           <name>:<wrapper>. The module name
//                                           must correspond with a module
//                                           specified using --module. The wrapper
//                                           must contain %s as the code
//                                           placeholder. The %basename%
//                                           placeholder can also be used to
//                                           substitute the base name of the
//                                           module output file.


// Reports:
//  --create_source_map VAL                : If specified, a source map file
//                                           mapping the generated source files
//                                           back to the original source file will
//                                           be output to the specified path. The
//                                           %outname% placeholder will expand to
//                                           the name of the output file that the
//                                           source map corresponds to. (default: )
//  --output_manifest VAL                  : Prints out a list of all the files in
//                                           the compilation. If --dependency_mode=
//                                           STRICT or LOOSE is specified, this
//                                           will not include files that got
//                                           dropped because they were not
//                                           required. The %outname% placeholder
//                                           expands to the JS output file. If
//                                           you're using modularization, using
//                                           %outname% will create a manifest for
//                                           each module. (default: )
//  --output_module_dependencies VAL       : Prints out a JSON file of
//                                           dependencies between modules.
//                                           (default: )
//  --property_renaming_report VAL         : File where the serialized version of
//                                           the property renaming map produced
//                                           should be saved (default: )
//  --source_map_include_content           : Includes sources content into source
//                                           map. Greatly increases the size of
//                                           source maps but offers greater
//                                           portability (default: false)
//  --source_map_input VAL                 : Source map locations for input files,
//                                           separated by a '|', (i.e.
//                                           input-file-path|input-source-map)
//  --source_map_location_mapping VAL      : Source map location mapping separated
//                                           by a '|' (i.e. filesystem-path|webserv
//                                           er-path)
//  --variable_renaming_report VAL         : File where the serialized version of
//                                           the variable renaming map produced
//                                           should be saved (default: )


// Miscellaneous:
//  --charset VAL                          : Input and output charset for all
//                                           files. By default, we accept UTF-8 as
//                                           input and output US_ASCII (default: )
//  --checks_only (--checks-only)          : Don't generate output. Run checks,
//                                           but no optimization passes. (default:
//                                           false)
//  --define (--D, -D) VAL                 : Override the value of a variable
//                                           annotated @define. The format is
//                                           <name>[=<val>], where <name> is the
//                                           name of a @define variable and <val>
//                                           is a boolean, number, or a
//                                           single-quoted string that contains no
//                                           single quotes. If [=<val>] is
//                                           omitted, the variable is marked true
//  --help                                 : Displays this message on stdout and
//                                           exit (default: true)
//  --third_party                          : Check source validity but do not
//                                           enforce Closure style rules and
//                                           conventions (default: false)
//  --use_types_for_optimization           : Enable or disable the optimizations
//                                           based on available type information.
//                                           Inaccurate type annotations may
//                                           result in incorrect results.
//                                           (default: true)
//  --version                              : Prints the compiler version to stdout
//                                           and exit. (default: false)