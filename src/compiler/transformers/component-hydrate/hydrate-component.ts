import * as d from '@declarations';
import { addNativeConnectedCallback } from '../component-native/native-connected-callback';
import { addNativeElementGetter } from '../component-native/native-element-getter';
import { addNativeRuntimeCmpMeta } from './native-runtime-cmp-meta';
import { addWatchers } from '../transforms/watcher-meta-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateNativeConstructor } from '../component-native/native-constructor';
import ts from 'typescript';


export function updateHydrateComponentClass(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta, build: d.Build) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateHydrateHostComponentMembers(classNode, cmp, build)
  );
}


function updateHydrateHostComponentMembers(classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta, build: d.Build) {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, cmp, build, false);
  addNativeConnectedCallback(classMembers, cmp, build);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addNativeRuntimeCmpMeta(classMembers, cmp);

  return classMembers;
}
