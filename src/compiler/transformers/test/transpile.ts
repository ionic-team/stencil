import * as d from '@declarations';
import { convertDecoratorsToStatic } from '../decorators-to-static/convert-decorators';
import { mockBuildCtx, mockCompilerCtx, mockConfig, mockStencilSystem } from '@testing';
import { convertStaticToMeta } from '../static-to-meta/visitor';
import ts from 'typescript';


export function transpileModule(input: string, config?: d.Config, compilerCtx?: d.CompilerCtx, sys?: d.StencilSystem) {
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
  const sourceFile = ts.createSourceFile(inputFileName, input, options.target);

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
  sys = sys || mockStencilSystem();

  const buildCtx = mockBuildCtx(config, compilerCtx);

  const transformOpts: d.TransformOptions = {
    addCompilerMeta: false,
    addStyle: false,
  };

  program.emit(undefined, undefined, undefined, undefined, {
    before: [
      convertDecoratorsToStatic(buildCtx.diagnostics, typeChecker)
    ],
    after: [
      convertStaticToMeta(sys, config, compilerCtx, buildCtx, typeChecker, null, transformOpts)
    ]
  });

  while (outputText.includes('  ')) {
    outputText = outputText.replace(/  /g, ' ');
  }

  const moduleFile = compilerCtx.moduleMap.values().next().value;
  const cmps = moduleFile ? moduleFile.cmps : null;
  const cmp = Array.isArray(cmps) && cmps.length > 0 ? cmps[0] : null;
  const tagName = cmp ? cmp.tagName : null;
  const componentClassName = cmp ? cmp.componentClassName : null;
  const properties = cmp ? cmp.properties : null;
  const virtualProperties = cmp ? cmp.virtualProperties : null;
  const property = properties ? properties[0] : null;
  const states = cmp ? cmp.states : null;
  const state = states ? states[0] : null;
  const listeners = cmp ? cmp.listeners : null;
  const listener = listeners ? listeners[0] : null;
  const events = cmp ? cmp.events : null;
  const event = events ? events[0] : null;
  const methods = cmp ? cmp.methods : null;
  const method = methods ? methods[0] : null;
  const elementRef = cmp ? cmp.elementRef : null;

  return {
    outputText,
    compilerCtx,
    buildCtx,
    diagnostics: buildCtx.diagnostics,
    moduleFile,
    cmps,
    cmp,
    componentClassName,
    tagName,
    properties,
    virtualProperties,
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
