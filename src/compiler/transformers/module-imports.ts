import * as d from '../../declarations';
import { addCollection } from './collections/add-collection';
import { getModule } from '../build/compiler-ctx';
import { normalizePath } from '../util';
import ts from 'typescript';


export function gatherModuleImports(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(moduleFile: d.Module, dirPath: string, importNode: ts.ImportDeclaration) {
      if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
        let importPath = importNode.moduleSpecifier.text;

        if (config.sys.path.isAbsolute(importPath)) {
          // absolute import
          importPath = normalizePath(importPath);
          moduleFile.localImports.push(importPath);

        } else if (importPath.startsWith('.')) {
          // relative import
          importPath = normalizePath(config.sys.path.resolve(dirPath, importPath));
          moduleFile.localImports.push(importPath);

        } else {
          // node resolve import
          if (!importNode.importClause) {
            // node resolve side effect import
            addCollection(config, compilerCtx, buildCtx.collections, moduleFile, config.rootDir, importPath);

            // test if this side effect import is a collection
            compilerCtx.collections = compilerCtx.collections || [];
            const isCollectionImport = compilerCtx.collections.some(c => {
              return c.collectionName === importPath;
            });

            if (isCollectionImport) {
              // turns out this is a side effect import is a collection,
              // we actually don't want to include this in the JS output
              // we've already gather the types we needed, kthxbai
              return null;
            }
          }

          moduleFile.externalImports.push(importPath);
        }
      }

      return importNode;
    }

    function visit(moduleFile: d.Module, dirPath: string, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(moduleFile, dirPath, node as ts.ImportDeclaration);
        default:
          return ts.visitEachChild(node, (node) => {
            return visit(moduleFile, dirPath, node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const moduleFile = getModule(compilerCtx, tsSourceFile.fileName);

      const dirPath = config.sys.path.dirname(tsSourceFile.fileName);

      return visit(moduleFile, dirPath, tsSourceFile) as ts.SourceFile;
    };
  };

}
