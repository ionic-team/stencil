import { convertValueToLiteral } from './util';
import { ComponentMeta, ModuleFile } from '../../../util/interfaces';
import * as ts from 'typescript';


export default function addMetadataExport(moduleFile: ModuleFile): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      const meta: ts.Expression = convertValueToLiteral(cmpMeta);

      const metadataProperty = ts.createProperty(
        undefined,
        [ts.createToken(ts.SyntaxKind.StaticKeyword)],
        'metadata',
        undefined,
        undefined,
        meta
      );
      return ts.updateClassDeclaration(
        classNode,
        classNode.decorators,
        classNode.modifiers,
        classNode.name,
        classNode.typeParameters,
        classNode.heritageClauses,
        classNode.members.concat(metadataProperty)
      );
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
      return visit(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
    };
  };

}
