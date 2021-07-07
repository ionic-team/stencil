import type * as d from '@stencil/core/declarations';
import { convertDecoratorsToStatic } from '../decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../static-to-meta/visitor';
import { mockBuildCtx, mockCompilerCtx, mockConfig, mockStencilSystem } from '@stencil/core/testing';
import ts from 'typescript';
import { updateModule } from '../static-to-meta/parse-static';
import { getScriptTarget } from '../transform-utils';

interface TsInputs {
  fileName: string, code: string, sourceFile?: ts.SourceFile
}

export function transpileModule(
  input: string | TsInputs[],
  config?: d.Config,
  compilerCtx?: d.CompilerCtx,
  sys?: d.CompilerSystem,
  beforeTransformers: ts.TransformerFactory<ts.SourceFile>[] = [],
  afterTransformers: ts.TransformerFactory<ts.SourceFile>[] = [],
) {
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
  options.noEmitHelpers = true;
  options.paths = undefined;
  options.rootDirs = undefined;
  options.declaration = undefined;
  options.composite = undefined;
  options.declarationDir = undefined;
  options.out = undefined;
  options.outFile = undefined;
  options.noResolve = true;

  options.module = ts.ModuleKind.ESNext;
  options.target = getScriptTarget();
  options.experimentalDecorators = true;

  options.jsx = ts.JsxEmit.React;
  options.jsxFactory = 'h';
  options.jsxFragmentFactory = 'Fragment';
  let outputText: string;

  let inputs: TsInputs[];
  if (typeof input === 'string') {
    inputs = [{fileName: 'module.tsx', code: input}];
  } else inputs = input;

  inputs = inputs.map(tsInput => {
    tsInput.sourceFile = ts.createSourceFile(tsInput.fileName, tsInput.code, getScriptTarget());
    return tsInput;
  })

  const emitCallback: ts.WriteFileCallback = (emitFilePath, data, _w, _e, tsSourceFiles) => {
    if (emitFilePath.endsWith('.js')) {
      outputText = data;
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, emitFilePath, tsTypeChecker, null);
    }
  };

  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName => (inputs.find(tsInput => tsInput.fileName === fileName)?.sourceFile || undefined),
    writeFile: emitCallback,
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => '',
    fileExists: fileName => !!inputs.find(tsInput => tsInput.fileName === fileName),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [],
  };
  const tsProgram = ts.createProgram(inputs.map(input => input.fileName), options, compilerHost);
  const tsTypeChecker = tsProgram.getTypeChecker();

  config = config || mockConfig();
  compilerCtx = compilerCtx || mockCompilerCtx(config);
  sys = sys || config.sys || (mockStencilSystem() as any);

  const buildCtx = mockBuildCtx(config, compilerCtx);

  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: 'lazy',
    componentMetadata: null,
    currentDirectory: '/',
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };

  tsProgram.emit(undefined, undefined, undefined, undefined, {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker), ...beforeTransformers],
    after: [convertStaticToMeta(config, compilerCtx, buildCtx, tsTypeChecker, null, transformOpts), ...afterTransformers],
  });

  while (outputText.includes('  ')) {
    outputText = outputText.replace(/  /g, ' ');
  }

  const mods = Array.from(compilerCtx.moduleMap.values());
  const moduleFile: d.Module = mods[mods.length-1];
  const cmps = moduleFile ? moduleFile.cmps : null;
  const cmp = Array.isArray(cmps) && cmps.length > 0 ? cmps[cmps.length-1] : null;
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
  const legacyConnect = cmp ? cmp.legacyConnect : null;
  const legacyContext = cmp ? cmp.legacyContext : null;

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
    elementRef,
    legacyContext,
    legacyConnect,
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
