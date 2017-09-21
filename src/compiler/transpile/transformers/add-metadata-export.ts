import * as ts from 'typescript';
import { convertValueToLiteral } from './util';
import { ModuleFiles, ComponentMeta } from '../../../util/interfaces';

export default function addMetadataExport(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      const meta: ts.Expression = convertValueToLiteral(cmpMeta);
      const metaDataExportNode = ts.createVariableStatement(
        [ts.createToken(ts.SyntaxKind.ExportKeyword), ts.createToken(ts.SyntaxKind.ConstKeyword)],
        [ts.createVariableDeclaration('metadat', undefined, meta)]
      );
      return [
        classNode,
        metaDataExportNode
      ];
    }

    function visit(node: ts.Node, cmpMeta: ComponentMeta): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(node as ts.ClassDeclaration, cmpMeta);
        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node, cmpMeta);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const moduleFile = moduleFiles[tsSourceFile.fileName];
      if (moduleFile) {
        return visit(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
      }
      return tsSourceFile;
    };
  };

}
