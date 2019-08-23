import * as d from '../../../declarations';
import { getModule, resetModule } from '../../build/compiler-ctx';
import { parseCallExpression } from './call-expression';
import { parseImport } from './import';
import { parseStaticComponentMeta } from './component';
import { parseStringLiteral } from './string-literal';
import ts from 'typescript';


export const convertStaticToMeta = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    let dirPath: string;
    let moduleFile: d.Module;
    const fileCmpNodes: ts.ClassDeclaration[] = [];

    const visitNode = (node: ts.Node) => {
      if (ts.isClassDeclaration(node)) {
        parseStaticComponentMeta(config, compilerCtx, transformCtx, typeChecker, node, moduleFile, compilerCtx.nodeMap, transformOpts, fileCmpNodes);
      } else if (ts.isImportDeclaration(node)) {
        parseImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node);
      } else if (ts.isCallExpression(node)) {
        parseCallExpression(moduleFile, node);
      } else if (ts.isStringLiteral(node)) {
        parseStringLiteral(moduleFile, node);
      }
      node.forEachChild(visitNode);
    };

    return tsSourceFile => {
      dirPath = config.sys.path.dirname(tsSourceFile.fileName);
      moduleFile = getModule(config, compilerCtx, tsSourceFile.fileName);
      resetModule(moduleFile);

      if (collection != null) {
        moduleFile.isCollectionDependency = true;
        moduleFile.collectionName = collection.collectionName;
        collection.moduleFiles.push(moduleFile);
      } else {
        moduleFile.isCollectionDependency = false;
        moduleFile.collectionName = null;
      }

      visitNode(tsSourceFile);
      return tsSourceFile;
    };
  };
};
