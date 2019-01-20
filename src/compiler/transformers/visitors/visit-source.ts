import * as d from '@declarations';
import { getModule, resetModule } from '../../build/compiler-ctx';
import { sys } from '@sys';
import { visitClass } from './visit-class';
import { visitImport } from './visit-import';
import ts from 'typescript';


export function visitSource(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta, addStaticCmpMetaData: boolean): ts.TransformerFactory<ts.SourceFile> {
  let dirPath: string;
  let moduleFile: d.Module;

  return transformCtx => {

    function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {

      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(transformCtx, moduleFile, typeChecker, node as ts.ClassDeclaration, addStaticCmpMetaData);

        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node as ts.ImportDeclaration);
      }

      return ts.visitEachChild(node, visitNode, transformCtx);
    }

    return tsSourceFile => {
      dirPath = sys.path.dirname(tsSourceFile.fileName);
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
