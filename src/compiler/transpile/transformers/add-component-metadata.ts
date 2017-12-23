import { convertValueToLiteral, getImportNameMapFromStyleMeta, StyleImport } from './util';
import { ComponentMeta, ModuleFiles } from '../../../util/interfaces';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { getStylePlaceholder, getStyleIdPlaceholder } from '../../../util/data-serialize';
import { formatComponentConstructorProperties } from '../../../util/data-serialize';
import * as ts from 'typescript';


export default function addComponentMetadata(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      let newMembers = [
        createGetter('is', convertValueToLiteral(cmpMeta.tagNameMeta)),
      ];
      if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
        newMembers.push(createGetter('encapsulation', convertValueToLiteral('shadow')));
      } else if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
        newMembers.push(createGetter('encapsulation', convertValueToLiteral('scoped')));
      }

      if (cmpMeta.hostMeta && Object.keys(cmpMeta.hostMeta).length > 0) {
        newMembers.push(createGetter('host', convertValueToLiteral(cmpMeta.hostMeta)));
      }

      const propertiesMeta = formatComponentConstructorProperties(cmpMeta.membersMeta);
      if (propertiesMeta && Object.keys(propertiesMeta).length > 0) {
        newMembers.push(createGetter('properties', convertValueToLiteral(propertiesMeta)));
      }
      if (cmpMeta.eventsMeta && cmpMeta.eventsMeta.length > 0) {
        newMembers.push(createGetter('events', convertValueToLiteral(cmpMeta.eventsMeta)));
      }

      if (cmpMeta.stylesMeta && Object.keys(cmpMeta.stylesMeta).length > 0) {
        const stylesMeta = Object.keys(cmpMeta.stylesMeta)
          .reduce((all, smn) => {
            return all.concat(getImportNameMapFromStyleMeta(cmpMeta.stylesMeta[smn]));
          }, [] as StyleImport[])
          .map(obj => obj.importName);

        if (stylesMeta.length > 0) {
          // awesome, we know we've got styles!
          // let's add the placeholder which we'll use later
          // after we generate the css
          newMembers.push(createGetter('style', convertValueToLiteral(getStylePlaceholder(cmpMeta.tagNameMeta))));

          if (!cmpMeta.stylesMeta[DEFAULT_STYLE_MODE]) {
            // if there's only one style, then there's no need for styleId
            // but if there are numerous style modes, then we'll need to add this
            newMembers.push(createGetter('styleId', convertValueToLiteral(getStyleIdPlaceholder(cmpMeta.tagNameMeta))));
          }
        }
      }

      return ts.updateClassDeclaration(
        classNode,
        classNode.decorators,
        classNode.modifiers,
        classNode.name,
        classNode.typeParameters,
        classNode.heritageClauses,
        [ ...classNode.members, ...newMembers]
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
      if (moduleFile && moduleFile.cmpMeta) {
        return visit(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
      }
      return tsSourceFile;
    };
  };
}

function createGetter(name: string, returnExpression: ts.Expression) {
  return ts.createGetAccessor(
    undefined,
    [ts.createToken(ts.SyntaxKind.StaticKeyword)],
    name,
    undefined,
    undefined,
    ts.createBlock([
      ts.createReturn(returnExpression)
    ])
  );
}
