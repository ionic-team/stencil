import * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { CompilerContext } from '../../compiler_next/build/compiler-ctx';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { isString, loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { nativeComponentTransform } from '../transformers/component-native/tranform-to-native-component';
import { lazyComponentTransformLegacy } from '../transformers/component-lazy/transform-lazy-component';
import { TestingLogger } from '../../testing/testing-logger';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import ts from 'typescript';


/**
 * Stand-alone compiling of a single string
 */
export const transpileModule = (config: d.Config, input: string, transformOpts: d.TransformOptions) => {
  if (!config.logger) {
    config = {
      logger: new TestingLogger(),
      ...config
    }
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
    sourceFilePath = (tsCompilerOptions.jsx ? `module.tsx` : `module.ts`);
  }

  const results: d.TranspileResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    map: null,
    diagnostics: [],
    moduleFile: null,
    build: {},
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

  if (tsCompilerOptions.paths && !isString(tsCompilerOptions.baseUrl)) {
    tsCompilerOptions.baseUrl = '.';
  }

  const sourceFile = ts.createSourceFile(sourceFilePath, input, tsCompilerOptions.target);

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName => {
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
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => transformOpts.currentDirectory || '',
    getNewLine: () => ts.sys.newLine,
    fileExists: fileName => normalizePath(fileName) === normalizePath(sourceFilePath),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => []
  };

  const program = ts.createProgram([sourceFilePath], tsCompilerOptions, compilerHost);
  const typeChecker = program.getTypeChecker();

  const after: ts.TransformerFactory<ts.SourceFile>[] = [
    convertStaticToMeta(config, compilerCtx, buildCtx, typeChecker, null, transformOpts)
  ];

  if (transformOpts.componentExport === 'customelement' || transformOpts.componentExport === 'module') {
    after.push(nativeComponentTransform(compilerCtx, transformOpts));

  } else {
    after.push(lazyComponentTransformLegacy(compilerCtx, transformOpts));
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


const getScriptTargetKind = (transformOpts: d.TransformOptions) => {
  switch (transformOpts.target) {
    case 'esnext': {
      return ts.ScriptTarget.ESNext;
    }
    case 'es2020': {
      return ts.ScriptTarget.ES2020;
    }
    case 'es2019': {
      return ts.ScriptTarget.ES2019;
    }
    case 'es2018': {
      return ts.ScriptTarget.ES2018;
    }
    case 'es2017': {
      return ts.ScriptTarget.ES2017;
    }
    case 'es2016': {
      return ts.ScriptTarget.ES2016;
    }
    case 'es2015': {
      return ts.ScriptTarget.ES2015;
    }
    case 'es5': {
      return ts.ScriptTarget.ES5;
    }
    default: {
      return ts.ScriptTarget.Latest;
    }
  }
}
