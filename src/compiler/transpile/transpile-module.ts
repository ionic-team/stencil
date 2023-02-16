import { isNumber, isString, loadTypeScriptDiagnostics, normalizePath } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { CompilerContext } from '../build/compiler-ctx';
import { getCurrentDirectory } from '../sys/environment';
import { createLogger } from '../sys/logger/console-logger';
import { lazyComponentTransform } from '../transformers/component-lazy/transform-lazy-component';
import { nativeComponentTransform } from '../transformers/component-native/tranform-to-native-component';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';

/**
 * Stand-alone compiling of a single string
 * @param config the Stencil configuration to use in the compilation process
 * @param input the string to compile
 * @param transformOpts a configuration object for how the string is compiled
 * @returns the results of compiling the provided input string
 */
export const transpileModule = (
  config: d.Config,
  input: string,
  transformOpts: d.TransformOptions
): d.TranspileModuleResults => {
  if (!config.logger) {
    config = {
      ...config,
      logger: createLogger(),
    };
  }
  const compilerCtx = new CompilerContext();
  const buildCtx = new BuildContext(config, compilerCtx);
  const tsCompilerOptions: ts.CompilerOptions = {
    ...config.tsCompilerOptions,
  };

  let sourceFilePath = transformOpts.file;
  if (isString(sourceFilePath)) {
    sourceFilePath = normalizePath(sourceFilePath);
  } else {
    sourceFilePath = tsCompilerOptions.jsx ? `module.tsx` : `module.ts`;
  }

  const results: d.TranspileModuleResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    map: null,
    diagnostics: [],
    moduleFile: null,
  };

  if (transformOpts.module === 'cjs') {
    tsCompilerOptions.module = ts.ModuleKind.CommonJS;
  } else {
    tsCompilerOptions.module = ts.ModuleKind.ESNext;
  }

  tsCompilerOptions.target = getScriptTargetKind(transformOpts);

  if ((sourceFilePath.endsWith('.tsx') || sourceFilePath.endsWith('.jsx')) && tsCompilerOptions.jsx == null) {
    // ensure we're setup for JSX in typescript
    tsCompilerOptions.jsx = ts.JsxEmit.React;
  }

  if (tsCompilerOptions.jsx != null && !isString(tsCompilerOptions.jsxFactory)) {
    tsCompilerOptions.jsxFactory = 'h';
  }

  if (tsCompilerOptions.jsx != null && !isString(tsCompilerOptions.jsxFragmentFactory)) {
    tsCompilerOptions.jsxFragmentFactory = 'Fragment';
  }

  if (tsCompilerOptions.paths && !isString(tsCompilerOptions.baseUrl)) {
    tsCompilerOptions.baseUrl = '.';
  }

  const sourceFile = ts.createSourceFile(sourceFilePath, input, tsCompilerOptions.target);

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: (fileName) => {
      return normalizePath(fileName) === normalizePath(sourceFilePath) ? sourceFile : undefined;
    },
    writeFile: (name, text) => {
      if (name.endsWith('.js.map')) {
        results.map = text;
      } else if (name.endsWith('.js')) {
        results.code = text;
      }
    },
    getDefaultLibFileName: () => `lib.d.ts`,
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => transformOpts.currentDirectory || getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine || '\n',
    fileExists: (fileName) => normalizePath(fileName) === normalizePath(sourceFilePath),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [],
  };

  const program = ts.createProgram([sourceFilePath], tsCompilerOptions, compilerHost);
  const typeChecker = program.getTypeChecker();

  const after: ts.TransformerFactory<ts.SourceFile>[] = [
    convertStaticToMeta(config, compilerCtx, buildCtx, typeChecker, null, transformOpts),
  ];

  if (transformOpts.componentExport === 'customelement' || transformOpts.componentExport === 'module') {
    after.push(nativeComponentTransform(compilerCtx, transformOpts));
  } else {
    after.push(lazyComponentTransform(compilerCtx, transformOpts));
  }

  program.emit(undefined, undefined, undefined, false, {
    before: [
      convertDecoratorsToStatic(config, buildCtx.diagnostics, typeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath),
    ],
    after,
  });

  const tsDiagnostics = [...program.getSyntacticDiagnostics()];

  if (config.validateTypes) {
    tsDiagnostics.push(...program.getOptionsDiagnostics());
  }

  buildCtx.diagnostics.push(...loadTypeScriptDiagnostics(tsDiagnostics));

  results.diagnostics.push(...buildCtx.diagnostics);

  results.moduleFile = compilerCtx.moduleMap.get(results.sourceFilePath);

  return results;
};

const getScriptTargetKind = (transformOpts: d.TransformOptions) => {
  const target = transformOpts.target && transformOpts.target.toUpperCase();
  if (isNumber((ts.ScriptTarget as any)[target])) {
    return (ts.ScriptTarget as any)[target];
  }
  // ESNext and Latest are the same
  return ts.ScriptTarget.Latest;
};
