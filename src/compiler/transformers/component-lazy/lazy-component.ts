import ts from 'typescript';

import type * as d from '../../../declarations';
import { addStaticStylePropertyToClass } from '../add-static-style';
import { transformHostData } from '../host-data-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateComponentClass } from '../update-component-class';
import { addWatchers } from '../watcher-meta-transform';
import { updateLazyComponentConstructor } from './lazy-constructor';
import { addLazyElementGetter } from './lazy-element-getter';

export const updateLazyComponentClass = (
  transformOpts: d.TransformOptions,
  styleStatements: ts.Statement[],
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
) => {
  const members = updateLazyComponentMembers(transformOpts, styleStatements, classNode, moduleFile, cmp);
  return updateComponentClass(transformOpts, classNode, classNode.heritageClauses, members, moduleFile);
};

const updateLazyComponentMembers = (
  transformOpts: d.TransformOptions,
  styleStatements: ts.Statement[],
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateLazyComponentConstructor(classMembers, moduleFile, cmp);
  addLazyElementGetter(classMembers, moduleFile, cmp);
  addWatchers(classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  if (transformOpts.style === 'static') {
    addStaticStylePropertyToClass(styleStatements, cmp);
  }

  return classMembers;
};
