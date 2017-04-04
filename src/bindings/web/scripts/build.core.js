var util = require('../../../../scripts/util');
var path = require('path');
var rollup = require('rollup');
var compiler = require(util.distPath('compiler'));
var fs = require('fs');


console.log('build ionic-core/web');


function bundleIonicJs() {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.js');
  var outputFile = util.distPath('ionic-core/web/ionic.js');

  return compiler.transpileFile(entryFile, outputFile, ['transform-es2015-classes'], true);
}


function bundleCoreJs() {
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.core.js');
  var outputFile = util.distPath('ionic-core/web/ionic.core.js');
  var outputFileMin = outputFile.replace('.js', '.min.js');

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document) {\n"use strict";\n',
      outro: '})(window, document);'
    });

    return compiler.transpile(result.code, outputFile, [], false).then(function(){
      return minify(outputFile, outputFileMin);
    });
  });
}


function bundleCoreEs5Js() {
  // create just the es5 and es5 minified files
  // then prefix each one with the web-component polyfill
  var entryFile = util.distPath('transpiled-web/bindings/web/src/ionic.core.es5.js');
  var outputFile = util.distPath('ionic-core/web/ionic.core.es5.js');
  var outputFileMin = outputFile.replace('.js', '.min.js');

  var ceReadPromise = util.readFile(util.srcPath('polyfills/webcomponents-sd-ce.js'));

  return rollup.rollup({
    entry: entryFile

  }).then(bundle => {
    var result = bundle.generate({
      format: 'es',
      intro: '(function(window, document) {\n"use strict";\n',
      outro: '})(window, document);'
    });

    return compiler.transpile(result.code, outputFile, ['transform-es2015-classes'], false).then(function(){
      return minifyES5(outputFile, outputFileMin).then(function() {

        return ceReadPromise.then(function(cePolyfill) {
          cePolyfill = cePolyfill.trim() + ';';

          var jsPromise = util.readFile(outputFile).then(function(content) {
            content = cePolyfill + content;
            return util.writeFile(outputFile, content)
          });

          var jsMinPromise = util.readFile(outputFileMin).then(function(content) {
            content = addUseStrict(content);

            content = cePolyfill + content;
            return util.writeFile(outputFileMin, content)
          });

          return Promise.all([
            jsPromise,
            jsMinPromise
          ]);

        });

      });
    });
  });
}


function minifyES5(inputFilePath, outputFilePath) {
  var ClosureCompiler = require('google-closure-compiler').compiler;

  var opts = {
    js: inputFilePath,
    externs: path.join(__dirname, 'externs.js'),
    language_out: 'ECMASCRIPT5',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    assume_function_wrapper: 'true',
    warning_level: 'VERBOSE',
    rewrite_polyfills: 'false',
    warning_level: 'QUIET',
    // formatting: 'PRETTY_PRINT',
    // debug: 'true'
  };

  var closureCompiler = new ClosureCompiler(opts);

  return new Promise(function(resolve, reject) {
    console.log(closureCompiler.commandArguments.join(' '));

    closureCompiler.run(function(exitCode, stdOut, stdErr) {
      if (stdErr) {
        console.log('closureCompiler exitCode', exitCode, 'stdErr', stdErr);
        reject(stdErr);

      } else {
        util.writeFile(outputFilePath, stdOut).then(() => {
          resolve();
        });
      }
    });
  });
}


function minify(inputFilePath, outputFilePath) {
  var closurePrepareFile = inputFilePath.replace('.js', '.closure.js');

  return preClosure(inputFilePath, closurePrepareFile).then(function() {

    var ClosureCompiler = require('google-closure-compiler').compiler;

    var opts = {
      js: closurePrepareFile,
      externs: path.join(__dirname, 'externs.js'),
      language_out: 'ECMASCRIPT5',
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      assume_function_wrapper: 'true',
      warning_level: 'VERBOSE',
      rewrite_polyfills: 'false',
      warning_level: 'QUIET',
      // formatting: 'PRETTY_PRINT',
      // debug: 'true'
    };

    var closureCompiler = new ClosureCompiler(opts);

    return new Promise(function(resolve, reject) {
      console.log(closureCompiler.commandArguments.join(' '));

      closureCompiler.run(function(exitCode, stdOut, stdErr) {
        if (stdErr) {
          console.log('closureCompiler exitCode', exitCode, 'stdErr', stdErr);
          reject(stdErr);

        } else {
          postClosure(outputFilePath, stdOut).then(function() {
            fs.unlink(closurePrepareFile);
            resolve();
          });
        }
      });
    });

  });
}


function preClosure(inputFilePath, closurePrepareFile) {
  return util.readFile(inputFilePath).then(function(content) {

    var match = /class (.*?) extends HTMLElement {}/gm.exec(content);
    if (!match) {
      throw 'preClosure: something done changed!'
    }

    content = content.replace(match[0], 'function ' + match[1] + ' () { "tricks-are-for-closure"; }');

    return util.writeFile(closurePrepareFile, content);
  });
}


function postClosure(outputFilePath, content) {
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

  var classReplacer = 'class ' + className + ' extends HTMLElement {}';

  content = content.replace(match[0], 'class ' + className + ' extends HTMLElement {}');

  content = addUseStrict(content);

  return util.writeFile(outputFilePath, content);
}

function addUseStrict(content) {
  // (function(B,U){
  var match = /\(function\((.*?),(.*?)\)\{/.exec(content);
  if (!match) {
    throw 'addUseStrict: something done changed!';
  }

  content = content.replace(match[0], '(function(' + match[1] + ',' + match[2] + '){"use-strict";')

  return content
}


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


Promise.all([
  util.readFile(util.srcPath('polyfills/webcomponents-sd-ce.js')),
  util.emptyDir(util.distPath('ionic-core/web'))
])

.then(results => {
  return Promise.all([
    bundleIonicJs(),
    bundleCoreJs(),
    bundleCoreEs5Js()
  ]);
});
