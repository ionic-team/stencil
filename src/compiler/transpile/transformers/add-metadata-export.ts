import { convertValueToLiteral } from './util';
import { ComponentMeta, ModuleFiles } from '../../../util/interfaces';
import * as ts from 'typescript';


/**
 * 1) Add static "properties" from previously gathered component metadata
 * 2) Add static "encapsulation"
 * 3) Add static "host"
 * 4) Add static "events"
 * 5) Add static "style"
 * 6) Add static "styleId"
 * 7) Add h() fn: const { h } = Namespace;
 * 8) Export component class with tag names as PascalCase
 */


export default function addMetadataExport(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      if (!cmpMeta) {
        return classNode;
      }
      const meta: ts.Expression = convertValueToLiteral({
        tagNameMeta: cmpMeta.tagNameMeta,
        hostMeta: cmpMeta.hostMeta,
        encapsulation: cmpMeta.encapsulation,
        stylesMeta: cmpMeta.stylesMeta,
        assetsDirMeta: cmpMeta.assetsDirsMeta,
        componentClass: cmpMeta.componentClass,
        membersMeta: cmpMeta.membersMeta,
        eventsMeta: cmpMeta.eventsMeta,
        listenersMeta: cmpMeta.listenersMeta
      });

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
        [ ...classNode.members, metadataProperty]
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
      const moduleFile = moduleFiles[tsSourceFile.fileName];
      const metadata = moduleFile ? moduleFile.cmpMeta : null;
      return visit(tsSourceFile, metadata) as ts.SourceFile;
    };
  };

}
