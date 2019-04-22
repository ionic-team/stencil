import * as d from '../../../declarations';
import ts from 'typescript';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateNativeConstructor } from './native-constructor';
import { addWatchers } from '../transforms/watcher-meta-transform';
import { transformHostData } from '../transforms/host-data-transform';
import { createStaticGetter } from '../transform-utils';


export function updateNativeComponentClass(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    updateNativeHostComponentHeritageClauses(classNode),
    updateNativeHostComponentMembers(classNode, cmp)
  );
}


function updateNativeHostComponentHeritageClauses(classNode: ts.ClassDeclaration) {
  if (classNode.heritageClauses != null && classNode.heritageClauses.length > 0) {
    return classNode.heritageClauses;
  }

  const heritageClause = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments([], ts.createIdentifier('HTMLElement'))
    ]
  );

  return [heritageClause];
}


function updateNativeHostComponentMembers(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, cmp, true);
  addNativeConnectedCallback(classMembers, cmp);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addComponentStyle(classMembers, cmp);
  transformHostData(classMembers);

  return classMembers;
}

export function addComponentStyle(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  if (!cmp.hasStyle) {
    return;
  }
  const style = cmp.styles[0];
  if (style == null || style.compiledStyleText == null) {
    console.log(cmp);
  }
  classMembers.push(createStaticGetter('style', ts.createStringLiteral(style.compiledStyleText)));
}
