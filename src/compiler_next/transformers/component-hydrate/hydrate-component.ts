import * as d from '../../../declarations';
import { addLazyElementGetter } from '../../../compiler/transformers/component-lazy/lazy-element-getter';
import { addHydrateRuntimeCmpMeta } from './hydrate-runtime-cmp-meta';
import { addWatchers } from '../../../compiler/transformers/watcher-meta-transform';
import { removeStaticMetaProperties } from '../../../compiler/transformers/remove-static-meta-properties';
import { transformHostData } from '../../../compiler/transformers/host-data-transform';
import { updateLazyComponentConstructor } from '../../../compiler/transformers/component-lazy/lazy-constructor';
import ts from 'typescript';


export const updateHydrateComponentClass = (classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateHydrateHostComponentMembers(classNode, moduleFile, cmp)
  );
};


const updateHydrateHostComponentMembers = (classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateLazyComponentConstructor(classMembers, moduleFile, cmp);
  addLazyElementGetter(classMembers, moduleFile, cmp);
  addWatchers(classMembers, cmp);
  addHydrateRuntimeCmpMeta(classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  return classMembers;
};
