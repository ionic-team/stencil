import * as d from '../../../declarations';
import { convertValueToLiteral } from './util';
import { DEFAULT_STYLE_MODE } from '../../../util/constants';
import { formatComponentConstructorEvents, formatComponentConstructorListeners, formatComponentConstructorProperties } from '../../../util/data-serialize';
import { formatConstructorEncapsulation, getStyleIdPlaceholder, getStylePlaceholder } from '../../../util/data-serialize';
import * as ts from 'typescript';


export default function addComponentMetadata(moduleFiles: d.ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: d.ComponentMeta) {
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

    function visit(node: ts.Node, cmpMeta: d.ComponentMeta): ts.VisitResult<ts.Node> {
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


export function addStaticMeta(cmpMeta: d.ComponentMeta) {
  const staticMembers: ConstructorComponentMeta = {};

  staticMembers.is = convertValueToLiteral(cmpMeta.tagNameMeta);

  const encapsulation = formatConstructorEncapsulation(cmpMeta.encapsulationMeta);
  if (encapsulation) {
    staticMembers.encapsulation = convertValueToLiteral(encapsulation);
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

  const listenerMeta = formatComponentConstructorListeners(cmpMeta.listenersMeta);
  if (listenerMeta && listenerMeta.length > 0) {
    staticMembers.listeners = convertValueToLiteral(listenerMeta);
  }

  if (cmpMeta.stylesMeta) {
    const styleModes = Object.keys(cmpMeta.stylesMeta);

    if (styleModes.length > 0) {
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
  listeners?: ts.Expression;
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
