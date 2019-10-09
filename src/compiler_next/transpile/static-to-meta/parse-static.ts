import * as d from '../../../declarations';
import { getModule, resetModule } from '../../../compiler/build/compiler-ctx';
import { parseCallExpression } from '../../../compiler/transformers/static-to-meta/call-expression';
import { parseImport } from '../../../compiler/transformers/static-to-meta/import';
import { parseStaticComponentMeta } from '../../../compiler/transformers/static-to-meta/component';
import { parseStringLiteral } from '../../../compiler/transformers/static-to-meta/string-literal';
import { visitClass } from '../../../compiler/transformers/decorators-to-static/convert-decorators';
import path from 'path';
import ts from 'typescript';


export const parseToModule = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsSourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta, transformOpts: d.TransformOptions) => {
  const dirPath = path.dirname(tsSourceFile.fileName);
  const moduleFile = getModule(config, compilerCtx, tsSourceFile.fileName);
  resetModule(moduleFile);

  const visitNode = (node: ts.Node) => {
    if (ts.isClassDeclaration(node)) {
      const classNode = visitClass(config, buildCtx.diagnostics, typeChecker, node);
      parseStaticComponentMeta(config, compilerCtx, typeChecker, classNode, moduleFile, compilerCtx.nodeMap, transformOpts);
    } else if (ts.isImportDeclaration(node)) {
      parseImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node);
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
  } else {
    moduleFile.isCollectionDependency = false;
    moduleFile.collectionName = null;
  }

  visitNode(tsSourceFile);

  return moduleFile;
};
