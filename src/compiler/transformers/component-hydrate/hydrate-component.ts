import * as d from '../../../declarations';
import { addLazyElementGetter } from '../component-lazy/lazy-element-getter';
import { addHydrateRuntimeCmpMeta } from './hydrate-runtime-cmp-meta';
import { addWatchers } from '../transforms/watcher-meta-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../transforms/host-data-transform';
import { updateLazyComponentConstructor } from '../component-lazy/lazy-constructor';
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

  updateLazyComponentConstructor(classMembers, cmp);
  addLazyElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addHydrateRuntimeCmpMeta(classMembers, cmp);
  transformHostData(classMembers);

  return classMembers;
}
