import * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { CompilerContext } from '../build/compiler-ctx';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { nativeComponentTransform } from '../transformers/component-native/tranform-to-native-component';
import { lazyComponentTransform } from '../transformers/component-lazy/transform-lazy-component';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import ts from 'typescript';


/**
 * Mainly used as the typescript preprocessor for unit tests
 */
export const transpileModule = (config: d.Config, input: string, transformOpts: d.TransformOptions, sourceFilePath?: string) => {
  const compilerCtx = new CompilerContext(config);
  const buildCtx = new BuildContext(config, compilerCtx);

  if (typeof sourceFilePath === 'string') {
    sourceFilePath = normalizePath(sourceFilePath);
  } else {
    sourceFilePath = (transformOpts.jsx ? `module.tsx` : `module.ts`);
  }

  const results: d.TranspileResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    map: null,
    diagnostics: [],
    moduleFile: null,
    build: {}
  };

  if ((sourceFilePath.endsWith('.tsx') || sourceFilePath.endsWith('.jsx')) && transformOpts.jsx == null) {
    // ensure we're setup for JSX in typescript
    transformOpts.jsx = ts.JsxEmit.React;
  }

  if (transformOpts.jsx != null && typeof transformOpts.jsxFactory !== 'string') {
    transformOpts.jsxFactory = 'h';
  }

  const sourceFile = ts.createSourceFile(sourceFilePath, input, transformOpts.target);

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

  const program = ts.createProgram([sourceFilePath], transformOpts, compilerHost);
  const typeChecker = program.getTypeChecker();

  const after: ts.TransformerFactory<ts.SourceFile>[] = [
    convertStaticToMeta(config, compilerCtx, buildCtx, typeChecker, null, transformOpts)
  ];

  if (transformOpts.componentExport === 'customelement' || transformOpts.componentExport === 'native') {
    after.push(nativeComponentTransform(compilerCtx, transformOpts));

  } else {
    after.push(lazyComponentTransform(compilerCtx, transformOpts));
  }

  program.emit(undefined, undefined, undefined, false, {
    before: [
      convertDecoratorsToStatic(config, buildCtx.diagnostics, typeChecker),
      updateStencilCoreImports(transformOpts.coreImportPath)
    ],
    after
  });

  const tsDiagnostics = [...program.getSyntacticDiagnostics()];

  if (config.validateTypes) {
    tsDiagnostics.push(...program.getOptionsDiagnostics());
  }

  buildCtx.diagnostics.push(
    ...loadTypeScriptDiagnostics(tsDiagnostics)
  );

  results.diagnostics.push(...buildCtx.diagnostics);

  results.moduleFile = compilerCtx.moduleMap.get(results.sourceFilePath);

  return results;
};

