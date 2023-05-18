import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, HTML_ELEMENT, RUNTIME_APIS } from '../core-runtime-apis';
import { transformHostData } from '../host-data-transform';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { updateComponentClass } from '../update-component-class';
import { addWatchers } from '../watcher-meta-transform';
import { addNativeConnectedCallback } from './native-connected-callback';
import { updateNativeConstructor } from './native-constructor';
import { addNativeElementGetter } from './native-element-getter';
import { addNativeComponentMeta } from './native-meta';
import { addNativeStaticStyle } from './native-static-style';

export const updateNativeComponentClass = (
  transformOpts: d.TransformOptions,
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
): ts.ClassDeclaration | ts.VariableStatement => {
  const heritageClauses = updateNativeHostComponentHeritageClauses(classNode, moduleFile);
  const members = updateNativeHostComponentMembers(transformOpts, classNode, moduleFile, cmp);
  return updateComponentClass(transformOpts, classNode, heritageClauses, members);
};

/**
 * Generate a heritage clause (e.g. `extends [IDENTIFIER]`) for a Stencil component to extend `HTMLElement`
 * @param classNode the syntax tree of the Stencil component class to update
 * @param moduleFile the Stencil Module associated with the provided class node
 * @returns the generated heritage clause
 */
const updateNativeHostComponentHeritageClauses = (
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module
): ts.NodeArray<ts.HeritageClause> | [ts.HeritageClause] => {
  if (classNode.heritageClauses != null && classNode.heritageClauses.length > 0) {
    // the syntax tree has a heritage clause already, don't generate a new one
    return classNode.heritageClauses;
  }

  if (moduleFile.cmps.length >= 1) {
    // we'll need to import `HTMLElement` in order to extend it
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.HTMLElement);
  }

  const heritageClause = ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
    ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier(HTML_ELEMENT), []),
  ]);

  return [heritageClause];
};

const updateNativeHostComponentMembers = (
  transformOpts: d.TransformOptions,
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
): ts.ClassElement[] => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, moduleFile, cmp);
  addNativeConnectedCallback(classMembers, cmp);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);

  if (cmp.isPlain) {
    addNativeComponentMeta(classMembers, cmp);
  }

  if (transformOpts.style === 'static') {
    addNativeStaticStyle(classMembers, cmp);
  }

  transformHostData(classMembers, moduleFile);

  return classMembers;
};
