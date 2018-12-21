import * as d from '../../../declarations';
import { convertDecoratorsToStatic } from '../decorators-to-static/convert-decorators';
import { gatherMeta } from '../static-to-meta/gather-meta';
import { mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import ts from 'typescript';


export function transpileModule(input: string) {
  const options = ts.getDefaultCompilerOptions();
  options.isolatedModules = true;
  // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
  options.suppressOutputPathCheck = true;
  // Filename can be non-ts file.
  options.allowNonTsExtensions = true;
  // We are not returning a sourceFile for lib file when asked by the program,
  // so pass --noLib to avoid reporting a file not found error.
  options.noLib = true;
  // Clear out other settings that would not be used in transpiling this module
  options.lib = undefined;
  options.types = undefined;
  options.noEmit = undefined;
  options.noEmitOnError = undefined;
  options.paths = undefined;
  options.rootDirs = undefined;
  options.declaration = undefined;
  options.composite = undefined;
  options.declarationDir = undefined;
  options.out = undefined;
  options.outFile = undefined;
  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  options.noResolve = true;

  options.module = ts.ModuleKind.ESNext;
  options.target = ts.ScriptTarget.ES2017;
  options.experimentalDecorators = true;


  // if jsx is specified then treat file as .tsx
  const inputFileName = (options.jsx ? 'module.tsx' : 'module.ts');
  const sourceFile = ts.createSourceFile(inputFileName, input, options.target); // TODO: GH#18217

  const newLine = '';

  // Output
  let outputText: string;

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: function (fileName) { return fileName === inputFileName ? sourceFile : undefined; },
    writeFile: function (_name, text) {
      outputText = text;
    },
    getDefaultLibFileName: function () { return 'lib.d.ts'; },
    useCaseSensitiveFileNames: function () { return false; },
    getCanonicalFileName: function (fileName) { return fileName; },
    getCurrentDirectory: function () { return ''; },
    getNewLine: function () { return newLine; },
    fileExists: function (fileName) { return fileName === inputFileName; },
    readFile: function () { return ''; },
    directoryExists: function () { return true; },
    getDirectories: function () { return []; }
  };

  const program = ts.createProgram([inputFileName], options, compilerHost);

  const typeChecker = program.getTypeChecker();
  const diagnostics: d.Diagnostic[] = [];

  const config = mockConfig();
  const compilerCtx = mockCompilerCtx();
  compilerCtx.moduleFiles = {};

  program.emit(/*targetSourceFile*/ undefined, /*writeFile*/ undefined, /*cancellationToken*/ undefined, /*emitOnlyDtsFiles*/ undefined, {
    before: [
      convertDecoratorsToStatic(diagnostics, typeChecker)
    ],
    after: [
      gatherMeta(config, compilerCtx, diagnostics, typeChecker)
    ]
  });

  while (outputText.includes('  ')) {
    outputText = outputText.replace(/  /g, ' ');
  }

  outputText = outputText.replace(/\"/g, `'`);

  const moduleFile = compilerCtx.moduleFiles[Object.keys(compilerCtx.moduleFiles)[0]];
  const cmpCompilerMeta: d.ComponentCompilerMeta = moduleFile ? moduleFile.cmpCompilerMeta : null;
  const tagName = cmpCompilerMeta ? cmpCompilerMeta.tagName : null;
  const componentClassName = cmpCompilerMeta ? cmpCompilerMeta.componentClassName : null;
  const properties = cmpCompilerMeta ? cmpCompilerMeta.properties : null;
  const property = properties ? properties[0] : null;
  const states = cmpCompilerMeta ? cmpCompilerMeta.states : null;
  const state = states ? states[0] : null;
  const listeners = cmpCompilerMeta ? cmpCompilerMeta.listeners : null;
  const listener = listeners ? listeners[0] : null;
  const events = cmpCompilerMeta ? cmpCompilerMeta.events : null;
  const event = events ? events[0] : null;
  const methods = cmpCompilerMeta ? cmpCompilerMeta.methods : null;
  const method = methods ? methods[0] : null;
  const elementRef = cmpCompilerMeta ? cmpCompilerMeta.elementRef : null;

  return {
    outputText,
    moduleFile,
    cmpCompilerMeta,
    componentClassName,
    tagName,
    properties,
    property,
    states,
    state,
    listeners,
    listener,
    events,
    event,
    methods,
    method,
    elementRef
  };
}
