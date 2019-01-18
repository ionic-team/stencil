import * as d from '@declarations';
import { getModule, resetModule } from '../../build/compiler-ctx';
import { sys } from '@sys';
import { visitCallExpression } from './visit-call-expression';
import { visitClass } from './visit-class';
import { visitImport } from './visit-import';
import { visitStringLiteral } from './visit-string-literal';
import ts from 'typescript';


export function visitSource(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta): ts.TransformerFactory<ts.SourceFile> {
  let dirPath: string;
  let moduleFile: d.Module;
  let tsSourceFile: ts.SourceFile;

  return transformContext => {

    function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {

      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          visitClass(compilerCtx, buildCtx, moduleFile, typeChecker, tsSourceFile, node as ts.ClassDeclaration);
          break;

        case ts.SyntaxKind.CallExpression:
          visitCallExpression(moduleFile, node as ts.CallExpression);
          break;

        case ts.SyntaxKind.StringLiteral:
          visitStringLiteral(moduleFile, node as ts.StringLiteral);
          break;

        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(config, compilerCtx, buildCtx, moduleFile, dirPath, node as ts.ImportDeclaration);
      }

      return ts.visitEachChild(node, visitNode, transformContext);
    }

    return sourceFile => {
      tsSourceFile = sourceFile;
      dirPath = sys.path.dirname(tsSourceFile.fileName);
      moduleFile = getModule(compilerCtx, tsSourceFile.fileName);

      // reset since we're doing a full parse again
      resetModule(moduleFile);

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
