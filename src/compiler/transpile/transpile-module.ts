import * as d from '@declarations';
import { BuildContext } from '../build/build-ctx';
import { CompilerContext } from '../build/compiler-ctx';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { lazyComponentTransform } from '../transformers/component-lazy/transform-lazy-component';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { sys } from '@sys';
import { validateConfig } from '../config/validate-config';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import ts from 'typescript';


/**
 * Mainly used as the typescript preprocessor for unit tests
 */
export function transpileModule(config: d.Config, input: string, opts: ts.CompilerOptions = {}, sourceFilePath?: string) {
  config = validateConfig(config);
  const compilerCtx = new CompilerContext(config);
  const buildCtx = new BuildContext(config, compilerCtx);

  if (typeof sourceFilePath === 'string') {
    sourceFilePath = normalizePath(sourceFilePath);
  } else {
    sourceFilePath = (opts.jsx ? `module.tsx` : `module.ts`);
  }

  const results: d.TranspileResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    map: null,
    diagnostics: [],
    moduleFile: null,
    build: {}
  };

  if (sourceFilePath.endsWith('.tsx')) {
    // ensure we're setup for JSX in typescript
    opts.jsx = ts.JsxEmit.React;
    opts.jsxFactory = 'h';
  }

  const sourceFile = ts.createSourceFile(sourceFilePath, input, opts.target);

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName => {
      return normalizePath(fileName) === normalizePath(sourceFilePath) ? sourceFile : undefined;
    },
    writeFile: (name, text) => {
      if (name.endsWith('.map')) {
        results.map = text;
      } else {
        results.code = text;
      }
    },
    getDefaultLibFileName: () => `lib.d.ts`,
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => ts.sys.newLine,
    fileExists: fileName => normalizePath(fileName) === normalizePath(sourceFilePath),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => []
  };

  const program = ts.createProgram([sourceFilePath], opts, compilerHost);
  const typeChecker = program.getTypeChecker();

  const transformOpts: d.TransformOptions = {
    addCompilerMeta: true,
    addStyle: false
  };

  program.emit(undefined, undefined, undefined, false, {
    before: [
      convertDecoratorsToStatic(config, buildCtx.diagnostics, typeChecker)
    ],
    after: [
      convertStaticToMeta(sys, config, compilerCtx, buildCtx, typeChecker, null, transformOpts),
      lazyComponentTransform(compilerCtx, transformOpts)
    ]
  });

  const tsDiagnostics = [...program.getSyntacticDiagnostics()];

  if (config.validateTypes) {
    tsDiagnostics.push(...program.getOptionsDiagnostics());
  }

  loadTypeScriptDiagnostics(buildCtx.diagnostics, tsDiagnostics);

  results.diagnostics.push(...buildCtx.diagnostics);

  results.moduleFile = compilerCtx.moduleMap.get(results.sourceFilePath);

  return results;
}
