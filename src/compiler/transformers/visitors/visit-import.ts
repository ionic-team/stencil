import * as d from '@declarations';
import { addCollection } from '../collections/add-collection';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import ts from 'typescript';


export function visitImport(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, dirPath: string, importNode: ts.ImportDeclaration) {
  if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
    let importPath = importNode.moduleSpecifier.text;

    if (sys.path.isAbsolute(importPath)) {
      // absolute import
      importPath = normalizePath(importPath);
      moduleFile.localImports.push(importPath);

    } else if (importPath.startsWith('.')) {
      // relative import
      importPath = normalizePath(sys.path.resolve(dirPath, importPath));
      moduleFile.localImports.push(importPath);

    } else {
      // node resolve import
      if (!importNode.importClause) {
        // node resolve side effect import
        addCollection(config, compilerCtx, buildCtx, moduleFile, config.rootDir, importPath);

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
