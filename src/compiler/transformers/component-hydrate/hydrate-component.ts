import * as d from '@declarations';
import { addNativeConnectedCallback } from '../component-native/native-connected-callback';
import { addNativeElementGetter } from '../component-native/native-element-getter';
import { addWatchers } from '../transforms/watcher-meta-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateNativeConstructor } from '../component-native/native-constructor';
import ts from 'typescript';


export function updateHydrateComponentClass(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateHydrateHostComponentMembers(classNode, cmp)
  );
}


function updateHydrateHostComponentMembers(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, cmp, false);
  addNativeConnectedCallback(classMembers);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);

  return classMembers;
}
