import type * as d from '../../declarations';
import { BuildContext } from '../build/build-ctx';
import { CompilerContext } from '../build/compiler-ctx';
import { convertDecoratorsToStatic } from '../transformers/decorators-to-static/convert-decorators';
import { convertStaticToMeta } from '../transformers/static-to-meta/visitor';
import { createLogger } from '../sys/logger/console-logger';
import { getCurrentDirectory } from '../sys/environment';
import { isNumber, isString, loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { lazyComponentTransform } from '../transformers/component-lazy/transform-lazy-component';
import { nativeComponentTransform } from '../transformers/component-native/tranform-to-native-component';
import { updateStencilCoreImports } from '../transformers/update-stencil-core-import';
import ts from 'typescript';
import { isDecoratorNamed } from '../transformers/decorators-to-static/decorator-utils';
import {
  findImportDeclObjWithModPath,
  findImportDeclsWithMemberNames,
  getMixinsFromDecorator,
  TSsourceFileWithModules,
} from '../transformers/transform-utils';

interface SourceFiles {
  path: string;
  source: ts.SourceFile;
  normalizedPath: string;
}

/**
 * Stand-alone compiling of a single string
 */
export const transpileModule = (config: d.Config, input: string, transformOpts: d.TransformOptions) => {
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

  const sourceFile = ts.createSourceFile(
    sourceFilePath,
    input,
    tsCompilerOptions.target
  ) as unknown as TSsourceFileWithModules;
  const sourceFiles: SourceFiles[] = [
    { path: sourceFilePath, source: sourceFile, normalizedPath: normalizePath(sourceFilePath) },
  ];

  // Add mixins and dependents to TS programe
  const classNode = sourceFile.statements.find(
    (st) => ts.isClassDeclaration(st) && st.decorators && st.decorators.find(isDecoratorNamed('Component', sourceFile))
  ) as ts.ClassDeclaration;

  if (classNode) {
    const mixinDecorators = classNode.decorators.filter(isDecoratorNamed('Mixin', sourceFile));

    if (mixinDecorators) {
      const { mixinClassNames } = getMixinsFromDecorator(mixinDecorators, sourceFile);
      const importDeclMap = findImportDeclsWithMemberNames(sourceFile, mixinClassNames);

      importDeclMap.forEach((value) => {
        const modPath = value.declaration.moduleSpecifier.getText(sourceFile).replace(/('|"|`)/g, '');
        const { classNames } = findImportDeclObjWithModPath(importDeclMap, modPath);
        if (!classNames.length) return;
        recursiveDependants(sourceFilePath, sourceFiles, modPath, tsCompilerOptions);
      });
    }
  }

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: (fileName) => {
      return sourceFiles.find((sf) => sf.normalizedPath === normalizePath(fileName))?.source || undefined;
    },
    writeFile: (name, text, _wom, _onerror, sourceFiles) => {
      if (normalizePath(sourceFiles[0].fileName) === normalizePath(sourceFilePath)) {
        if (name.endsWith('.js.map')) {
          results.map = text;
        } else if (name.endsWith('.js')) {
          results.code = text;
        }
      }
    },
    getDefaultLibFileName: () => `lib.d.ts`,
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => transformOpts.currentDirectory || getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine || '\n',
    fileExists: (fileName) => !!sourceFiles.find((sf) => sf.normalizedPath === normalizePath(fileName)),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [],
  };

  const program = ts.createProgram(
    sourceFiles.map((sf) => sf.path),
    tsCompilerOptions,
    compilerHost
  );
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
      convertDecoratorsToStatic(config, buildCtx.diagnostics, typeChecker, compilerHost),
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

const fileExists = (fileName: string): boolean => {
  return ts.sys.fileExists(fileName);
};
const readFile = (fileName: string): string | undefined => {
  return ts.sys.readFile(fileName);
};

const recursiveDependants = (
  srcFilePath: string,
  sourceFiles: SourceFiles[],
  modPath: string,
  tsCompilerOptions: ts.CompilerOptions
) => {
  let mod = ts.resolveModuleName(modPath, srcFilePath, tsCompilerOptions, { fileExists, readFile });
  if (mod && mod.resolvedModule) {
    const foundPath = mod.resolvedModule.resolvedFileName;
    const foundSourceFile = ts.createSourceFile(
      foundPath,
      readFile(foundPath),
      tsCompilerOptions.target
    ) as unknown as TSsourceFileWithModules;
    sourceFiles.push({ path: foundPath, source: foundSourceFile, normalizedPath: normalizePath(foundPath) });

    foundSourceFile.statements
      .filter((st) => ts.isImportDeclaration(st))
      .forEach((st: ts.ImportDeclaration) =>
        recursiveDependants(foundPath, sourceFiles, (<ts.StringLiteral>st.moduleSpecifier).text, tsCompilerOptions)
      );
  }
};
