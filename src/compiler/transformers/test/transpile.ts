import * as d from '@declarations';
import { convertDecoratorsToStatic } from '../decorators-to-static/convert-decorators';
import { mockBuildCtx, mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import { visitSource } from '../visitors/visit-source';
import ts from 'typescript';


export function transpileModule(input: string, config?: d.Config, compilerCtx?: d.CompilerCtx) {
  const options = ts.getDefaultCompilerOptions();
  options.isolatedModules = true;
  options.suppressOutputPathCheck = true;
  options.allowNonTsExtensions = true;
  options.removeComments = false;
  options.noLib = true;
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
  options.noResolve = true;

  options.module = ts.ModuleKind.ESNext;
  options.target = ts.ScriptTarget.ES2017;
  options.experimentalDecorators = true;

  options.jsx = ts.JsxEmit.React;
  options.jsxFactory = 'h';

  const inputFileName = 'module.tsx';
  const sourceFile = ts.createSourceFile(inputFileName, input, options.target); // TODO: GH#18217

  let outputText: string;

  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName => fileName === inputFileName ? sourceFile : undefined,
    writeFile: (_, text) => outputText = text,
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => '',
    fileExists: fileName => fileName === inputFileName,
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => []
  };

  const program = ts.createProgram([inputFileName], options, compilerHost);

  const typeChecker = program.getTypeChecker();

  config = config || mockConfig();
  compilerCtx = compilerCtx || mockCompilerCtx();
  compilerCtx.moduleMap = compilerCtx.moduleMap || new Map();

  const buildCtx = mockBuildCtx(config, compilerCtx);

  program.emit(undefined, undefined, undefined, undefined, {
    before: [
      convertDecoratorsToStatic(buildCtx.diagnostics, typeChecker)
    ],
    after: [
      visitSource(config, compilerCtx, buildCtx, typeChecker, null)
    ]
  });

  while (outputText.includes('  ')) {
    outputText = outputText.replace(/  /g, ' ');
  }

  const moduleFile = compilerCtx.moduleMap.values().next().value;
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
    compilerCtx,
    buildCtx,
    diagnostics: buildCtx.diagnostics,
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

export function getStaticGetter(output: string, prop: string) {
  const toEvaludate = `return ${output.replace('export', '')}`;
  try {
    const Obj = new Function(toEvaludate);
    return Obj()[prop];
  } catch (e) {
    console.error(e);
    console.error(toEvaludate);
  }
}
