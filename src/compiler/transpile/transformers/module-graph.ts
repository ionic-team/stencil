import { BuildCtx, Config, ModuleGraph } from '../../../declarations/index';
import { normalizePath, pathJoin } from '../../util';
import ts from 'typescript';


export function moduleGraph(config: Config, buildCtx: BuildCtx): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(moduleGraph: ModuleGraph, dirPath: string, importNode: ts.ImportDeclaration) {
      if (importNode.moduleSpecifier) {
        let importPath = importNode.moduleSpecifier.getText().replace(/\'|\"|\`/g, '');

        if (importPath.startsWith('.') || importPath.startsWith('/')) {
          importPath = pathJoin(config, dirPath, importPath);
        }

        moduleGraph.importPaths.push(importPath);
      }

      return importNode;
    }

    function visit(moduleGraph: ModuleGraph, dirPath: string, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(moduleGraph, dirPath, node as ts.ImportDeclaration);
        default:
          return ts.visitEachChild(node, (node) => {
            return visit(moduleGraph, dirPath, node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const moduleGraph: ModuleGraph = {
        filePath: normalizePath(tsSourceFile.fileName),
        importPaths: []
      };

      const dirPath = config.sys.path.dirname(tsSourceFile.fileName);

      buildCtx.moduleGraphs.push(moduleGraph);

      return visit(moduleGraph, dirPath, tsSourceFile) as ts.SourceFile;
    };
  };

}
