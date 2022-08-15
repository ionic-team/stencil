import type * as d from '@stencil/core/declarations';
import { convertDecoratorsToStatic } from '../decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../static-to-meta/visitor';
import { mockBuildCtx, mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import ts from 'typescript';
import { updateModule } from '../static-to-meta/parse-static';
import { getScriptTarget } from '../transform-utils';
import { mapImportsToPathAliases } from '../map-imports-to-path-aliases';

/**
 * Testing utility for transpiling provided string containing valid Stencil code
 * @param input the code to transpile
 * @param config a Stencil configuration to apply during the transpilation
 * @param compilerCtx a compiler context to use in the transpilation process
 * @param beforeTransformers TypeScript transformers that should be applied before the code is emitted
 * @param afterTransformers TypeScript transformers that should be applied after the code is emitted
 * @returns the result of the transpilation step
 */
export function transpileModule(
  input: string,
  config?: d.Config,
  compilerCtx?: d.CompilerCtx,
  beforeTransformers: ts.TransformerFactory<ts.SourceFile>[] = [],
  afterTransformers: ts.TransformerFactory<ts.SourceFile>[] = []
) {
  let options = ts.getDefaultCompilerOptions();
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
  options.noResolve = false;

  options.module = ts.ModuleKind.ESNext;
  options.target = getScriptTarget();
  options.experimentalDecorators = true;

  options.jsx = ts.JsxEmit.React;
  options.jsxFactory = 'h';
  options.jsxFragmentFactory = 'Fragment';

  /**
   * Override the options with the supplied compiler options on the config.
   * This ensures that the path and baseUrl attributes are passed to the transformer correctly.
   */
  options = {
    ...options,
    ...config?.tsCompilerOptions,
  };

  /**
   * Updating the method to transpile multiple source files just to try to mock
   * how the TS compiler would work in a real build.
   */
  const sourceFiles = [
    ts.createSourceFile('utils.tsx', 'export function test() {}', options.target, true),
    ts.createSourceFile('module.tsx', input, options.target, true),
  ];

  let outputText: string;

  const emitCallback: ts.WriteFileCallback = (emitFilePath, data, _w, _e, tsSourceFiles) => {
    if (emitFilePath.endsWith('.js')) {
      outputText = data;
      updateModule(config, compilerCtx, buildCtx, tsSourceFiles[0], data, emitFilePath, tsTypeChecker, null);
    }
  };

  const compilerHost: ts.CompilerHost = {
    getSourceFile: (fileName) => sourceFiles.find((ref) => ref.fileName === fileName),
    writeFile: emitCallback,
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => '',
    fileExists: (fileName) => !!sourceFiles.find((ref) => ref.fileName === fileName),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [],
  };

  const tsProgram = ts.createProgram(
    sourceFiles.map((ref) => ref.fileName),
    options,
    compilerHost
  );
  const tsTypeChecker = tsProgram.getTypeChecker();

  config = config || mockConfig();
  compilerCtx = compilerCtx || mockCompilerCtx(config);

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

  tsProgram.emit(undefined, emitCallback, undefined, undefined, {
    before: [convertDecoratorsToStatic(config, buildCtx.diagnostics, tsTypeChecker), ...beforeTransformers],
    after: [
      convertStaticToMeta(config, compilerCtx, buildCtx, tsTypeChecker, null, transformOpts),
      // Hard-coding this here until failures are resolved.
      mapImportsToPathAliases({
        ...config,
        tsCompilerOptions: options,
      }),
      ...afterTransformers,
    ],
  });

  while (outputText.includes('  ')) {
    outputText = outputText.replace(/  /g, ' ');
  }

  const moduleFile: d.Module = compilerCtx.moduleMap.values().next().value;
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
  const toEvaluate = `return ${output.replace('export', '')}`;
  try {
    const Obj = new Function(toEvaluate);
    return Obj()[prop];
  } catch (e) {
    console.error(e);
    console.error(toEvaluate);
  }
}
