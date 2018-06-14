import * as d from '../../../declarations';
import { getModuleFile } from '../../build/compiler-ctx';
import { normalizePath } from '../../util';
import * as ts from 'typescript';


export function getModuleImports(config: d.Config, compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(moduleFile: d.ModuleFile, dirPath: string, importNode: ts.ImportDeclaration) {
      if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
        let importPath = importNode.moduleSpecifier.text;

        if (config.sys.path.isAbsolute(importPath)) {
          importPath = normalizePath(importPath);
          moduleFile.localImports.push(importPath);

        } else if (importPath.startsWith('.')) {
          importPath = normalizePath(config.sys.path.resolve(dirPath, importPath));
          moduleFile.localImports.push(importPath);

        } else {
          moduleFile.externalImports.push(importPath);
        }
      }

      return importNode;
    }

    function visit(moduleFile: d.ModuleFile, dirPath: string, node: ts.Node): ts.VisitResult<ts.Node> {
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
      const moduleFile = getModuleFile(compilerCtx, tsSourceFile.fileName);

      const dirPath = config.sys.path.dirname(tsSourceFile.fileName);

      return visit(moduleFile, dirPath, tsSourceFile) as ts.SourceFile;
    };
  };

}
