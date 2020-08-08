import type * as d from '../../../declarations';
import { addLazyElementGetter } from '../component-lazy/lazy-element-getter';
import { addHydrateRuntimeCmpMeta } from './hydrate-runtime-cmp-meta';
import { addWatchers } from '../watcher-meta-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../host-data-transform';
import { updateLazyComponentConstructor } from '../component-lazy/lazy-constructor';
import ts from 'typescript';

export const updateHydrateComponentClass = (classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateHydrateHostComponentMembers(classNode, moduleFile, cmp),
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
