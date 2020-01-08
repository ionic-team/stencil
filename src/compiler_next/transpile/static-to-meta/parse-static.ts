import * as d from '../../../declarations';
import { normalizePath } from '@utils';
import { parseCallExpression } from '../../../compiler/transformers/static-to-meta/call-expression';
import { parseImport } from './import';
import { parseStaticComponentMeta } from '../../../compiler/transformers/static-to-meta/component';
import { parseStringLiteral } from '../../../compiler/transformers/static-to-meta/string-literal';
import { dirname, basename, join } from 'path';
import ts from 'typescript';


export const updateModule = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  tsSourceFile: ts.SourceFile,
  sourceFileText: string,
  emitFilePath: string,
  typeChecker: ts.TypeChecker,
  collection: d.CollectionCompilerMeta
) => {
  const sourceFilePath = normalizePath(tsSourceFile.fileName);
  const prevModuleFile = getModule(compilerCtx, sourceFilePath);

  if (prevModuleFile && prevModuleFile.staticSourceFileText === sourceFileText) {
    return prevModuleFile;
  }

  const srcDirPath = dirname(sourceFilePath);
  const emitFileName = basename(emitFilePath);
  emitFilePath = normalizePath(join(srcDirPath, emitFileName));

  const moduleFile = createModule(tsSourceFile, sourceFileText, emitFilePath);
  compilerCtx.moduleMap.set(moduleFile.sourceFilePath, moduleFile);
  compilerCtx.changedModules.add(moduleFile.sourceFilePath);

  const visitNode = (node: ts.Node) => {
    if (ts.isClassDeclaration(node)) {
      parseStaticComponentMeta(config, compilerCtx, typeChecker, node, moduleFile, compilerCtx.nodeMap);
      return;
    } else if (ts.isImportDeclaration(node)) {
      parseImport(config, compilerCtx, buildCtx, moduleFile, srcDirPath, node);
      return;
    } else if (ts.isCallExpression(node)) {
      parseCallExpression(moduleFile, node);
    } else if (ts.isStringLiteral(node)) {
      parseStringLiteral(moduleFile, node);
    }
    node.forEachChild(visitNode);
  };

  if (collection != null) {
    moduleFile.isCollectionDependency = true;
    moduleFile.collectionName = collection.collectionName;
    collection.moduleFiles.push(moduleFile);
  }
  visitNode(tsSourceFile);

  // TODO: workaround around const enums
  // find better way
  if (moduleFile.cmps.length > 0) {
    moduleFile.staticSourceFile = ts.createSourceFile(sourceFilePath, sourceFileText, tsSourceFile.languageVersion, true, ts.ScriptKind.JS);
  }
  return moduleFile;
};

export const getModule = (compilerCtx: d.CompilerCtx, fileName: string) => {
  return compilerCtx.moduleMap.get(fileName);
};

export const createModule = (
  staticSourceFile: ts.SourceFile, // this is NOT the original
  staticSourceFileText: string,
  emitFilepath: string,
) => {
  const sourceFilePath = normalizePath(staticSourceFile.fileName);
  const moduleFile: d.Module = {
    sourceFilePath: sourceFilePath,
    jsFilePath: emitFilepath,
    staticSourceFile,
    staticSourceFileText,
    cmps: [],
    coreRuntimeApis: [],
    collectionName: null,
    dtsFilePath: null,
    excludeFromCollection: false,
    externalImports: [],
    hasVdomAttribute: false,
    hasVdomXlink: false,
    hasVdomClass: false,
    hasVdomFunctional: false,
    hasVdomKey: false,
    hasVdomListener: false,
    hasVdomRef: false,
    hasVdomRender: false,
    hasVdomStyle: false,
    hasVdomText: false,
    htmlAttrNames: [],
    htmlTagNames: [],
    isCollectionDependency: false,
    isLegacy: false,
    localImports: [],
    originalCollectionComponentPath: null,
    originalImports: [],
    potentialCmpRefs: []
  };
  return moduleFile;
};
