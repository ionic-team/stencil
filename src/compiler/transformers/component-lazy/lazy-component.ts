import * as d from '../../../declarations';
import { addComponentStylePlaceholders } from '../component-style';
import { addLazyElementGetter } from './lazy-element-getter';
import { addWatchers } from '../watcher-meta-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../host-data-transform';
import { updateLazyComponentConstructor } from './lazy-constructor';
import ts from 'typescript';


export const updateLazyComponentClass = (opts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateLazyComponentMembers(opts, classNode, moduleFile, cmp)
  );
};


const updateLazyComponentMembers = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateLazyComponentConstructor(classMembers, moduleFile, cmp);
  addLazyElementGetter(classMembers, moduleFile, cmp);
  addWatchers(classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  if (transformOpts.styleImport === 'inline') {
    addComponentStylePlaceholders(classMembers, cmp);
  }

  return classMembers;
};
