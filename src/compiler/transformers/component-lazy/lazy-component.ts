import * as d from '@declarations';
import { addComponentStyle } from '../component-style';
import { addLazyElementGetter } from './lazy-element-getter';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateLazyComponentConstructor } from './lazy-constructor';
import ts from 'typescript';


export function updateLazyComponentClass(opts: d.TransformOptions, classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    classNode.modifiers,
    classNode.name,
    classNode.typeParameters,
    classNode.heritageClauses,
    updateLazyComponentMembers(opts, classNode, cmp)
  );
}


function updateLazyComponentMembers(opts: d.TransformOptions, classNode: ts.ClassDeclaration, cmp: d.ComponentCompilerMeta) {
  const classMembers = removeStaticMetaProperties(classNode);

  updateLazyComponentConstructor(classMembers, cmp);
  addLazyElementGetter(classMembers, cmp);

  if (opts.addStyle) {
    addComponentStyle(classMembers, cmp);
  }

  return classMembers;
}
