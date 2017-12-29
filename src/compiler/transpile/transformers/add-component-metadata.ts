import { convertValueToLiteral, getImportNameMapFromStyleMeta, StyleImport } from './util';
import { ComponentMeta, ModuleFiles } from '../../../util/interfaces';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { getStylePlaceholder, getStyleIdPlaceholder } from '../../../util/data-serialize';
import { formatComponentConstructorEvents, formatComponentConstructorProperties } from '../../../util/data-serialize';
import * as ts from 'typescript';


export default function addComponentMetadata(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      const staticMembers = addStaticMeta(cmpMeta);

      const newMembers = Object.keys(staticMembers).map(memberName => {
        return createGetter(memberName, (staticMembers as any)[memberName]);
      });

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


export function addStaticMeta(cmpMeta: ComponentMeta) {
  const staticMembers: ConstructorComponentMeta = {};

  staticMembers.is = convertValueToLiteral(cmpMeta.tagNameMeta);

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    staticMembers.encapsulation = convertValueToLiteral('shadow');

  } else if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    staticMembers.encapsulation = convertValueToLiteral('scoped');
  }

  if (cmpMeta.hostMeta && Object.keys(cmpMeta.hostMeta).length > 0) {
    staticMembers.host = convertValueToLiteral(cmpMeta.hostMeta);
  }

  const propertiesMeta = formatComponentConstructorProperties(cmpMeta.membersMeta);
  if (propertiesMeta && Object.keys(propertiesMeta).length > 0) {
    staticMembers.properties = convertValueToLiteral(propertiesMeta);
  }

  const eventsMeta = formatComponentConstructorEvents(cmpMeta.eventsMeta);
  if (eventsMeta && eventsMeta.length > 0) {
    staticMembers.events = convertValueToLiteral(eventsMeta);
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
      staticMembers.style = convertValueToLiteral(getStylePlaceholder(cmpMeta.tagNameMeta));

      if (!cmpMeta.stylesMeta[DEFAULT_STYLE_MODE]) {
        // if there's only one style, then there's no need for styleId
        // but if there are numerous style modes, then we'll need to add this
        staticMembers.styleMode = convertValueToLiteral(getStyleIdPlaceholder(cmpMeta.tagNameMeta));
      }
    }
  }

  return staticMembers;
}


export interface ConstructorComponentMeta {
  is?: ts.Expression;
  encapsulation?: ts.Expression;
  host?: ts.Expression;
  properties?: ts.Expression;
  didChange?: ts.Expression;
  willChange?: ts.Expression;
  events?: ts.Expression;
  style?: ts.Expression;
  styleMode?: ts.Expression;
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
