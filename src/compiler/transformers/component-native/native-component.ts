import * as d from '../../../declarations';
import ts from 'typescript';
import { addComponentStyle } from '../component-style';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateNativeConstructor } from './native-constructor';
import { addWatchers } from '../transforms/watcher-meta-transform';
import { transformHostData } from '../transforms/host-data-transform';


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

