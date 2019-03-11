import * as d from '@declarations';
import { getModule, resetModule } from '../../build/compiler-ctx';
import ts from 'typescript';
import { parseStaticComponentMeta } from './component';
import { parseImport } from './import';


export function convertStaticToMeta(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> {
  let dirPath: string;
  let moduleFile: d.Module;

  return transformCtx => {

    function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {

      if (ts.isClassDeclaration(node)) {
        return parseStaticComponentMeta(config, transformCtx, typeChecker, node, moduleFile, compilerCtx.nodeMap, transformOpts);
      } else if (ts.isImportDeclaration(node)) {
        return parseImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node);
      }
      return ts.visitEachChild(node, visitNode, transformCtx);
    }

    return tsSourceFile => {
      dirPath = config.sys.path.dirname(tsSourceFile.fileName);
      moduleFile = getModule(compilerCtx, tsSourceFile.fileName);

      if (buildCtx.isRebuild) {
        // reset since we're doing a full parse again
        resetModule(moduleFile);
      }

      if (collection != null) {
        moduleFile.isCollectionDependency = true;
        moduleFile.collectionName = collection.collectionName;
        collection.moduleFiles.push(moduleFile);

      } else {
        moduleFile.isCollectionDependency = false;
        moduleFile.collectionName = null;
      }

      return visitNode(tsSourceFile) as ts.SourceFile;
    };
  };
}
