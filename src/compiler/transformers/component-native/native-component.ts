import * as d from '../../../declarations';
import { addNativeComponentMeta } from './native-meta';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { addNativeStaticStyle } from './native-static-style';
import { addWatchers } from '../watcher-meta-transform';
import { HTML_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../host-data-transform';
import { updateComponentClass } from '../update-component-class';
import { updateNativeConstructor } from './native-constructor';
import ts from 'typescript';

export const updateNativeComponentClass = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const heritageClauses = updateNativeHostComponentHeritageClauses(classNode, moduleFile);
  const members = updateNativeHostComponentMembers(transformOpts, classNode, moduleFile, cmp);
  return updateComponentClass(transformOpts, classNode, heritageClauses, members);
};

const updateNativeHostComponentHeritageClauses = (classNode: ts.ClassDeclaration, moduleFile: d.Module) => {
  if (classNode.heritageClauses != null && classNode.heritageClauses.length > 0) {
    return classNode.heritageClauses;
  }

  if (moduleFile.cmps.length > 1) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.HTMLElement);
  }

  const heritageClause = ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [ts.createExpressionWithTypeArguments([], ts.createIdentifier(HTML_ELEMENT))]);

  return [heritageClause];
};

const updateNativeHostComponentMembers = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, moduleFile, cmp, true);
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
