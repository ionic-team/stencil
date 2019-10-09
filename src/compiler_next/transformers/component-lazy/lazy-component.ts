import * as d from '../../../declarations';
import { addLazyElementGetter } from '../../../compiler/transformers/component-lazy/lazy-element-getter';
import { addStaticStyle } from '../add-static-style';
import { addWatchers } from '../../../compiler/transformers/watcher-meta-transform';
import { removeStaticMetaProperties } from '../../../compiler/transformers/remove-static-meta-properties';
import { transformHostData } from '../../../compiler/transformers/host-data-transform';
import { updateComponentClass } from '../../../compiler/transformers/update-component-class';
import { updateLazyComponentConstructor } from '../../../compiler/transformers/component-lazy/lazy-constructor';
import ts from 'typescript';


export const updateLazyComponentClass = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const members = updateLazyComponentMembers(transformOpts, classNode, moduleFile, cmp);
  return updateComponentClass(transformOpts, classNode, classNode.heritageClauses, members);
};


const updateLazyComponentMembers = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateLazyComponentConstructor(classMembers, moduleFile, cmp);
  addLazyElementGetter(classMembers, moduleFile, cmp);
  addWatchers(classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  if (transformOpts.style === 'static') {
    addStaticStyle(classMembers, cmp);
  }

  return classMembers;
};
