import * as d from '../../../declarations';
import { addLazyElementGetter } from './lazy-element-getter';
import { addWatchers } from '../watcher-meta-transform';
import { createStaticGetter } from '../transform-utils';
import { getStyleTextPlaceholder } from '../../app-core/component-styles';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../host-data-transform';
import { updateComponentClass } from '../update-component-class';
import { updateLazyComponentConstructor } from './lazy-constructor';
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
    addComponentStylePlaceholders(classMembers, cmp);
  }

  return classMembers;
};


const addComponentStylePlaceholders = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (cmp.hasStyle) {
    classMembers.push(createStaticGetter('style', ts.createStringLiteral(getStyleTextPlaceholder(cmp))));
  }
};
