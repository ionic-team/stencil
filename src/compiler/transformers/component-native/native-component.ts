import * as d from '../../../declarations';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { addWatchers } from '../watcher-meta-transform';
import { createStaticGetter } from '../transform-utils';
import { getScopeId } from '../../style/scope-css';
import { HTML_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { scopeCss } from '../../../utils/shadow-css';
import { transformHostData } from '../host-data-transform';
import { updateNativeConstructor } from './native-constructor';
import ts from 'typescript';


export const updateNativeComponentClass = (classNode: ts.ClassDeclaration, transformOpts: d.TransformOptions, moduleFile: d.Module, cmp: d.ComponentCompilerMeta, removeExport: boolean) => {
  let modifiers = Array.isArray(classNode.modifiers) ? classNode.modifiers.slice() : [];

  if (removeExport) {
    modifiers = modifiers.filter(m => {
      return m.kind !== ts.SyntaxKind.ExportKeyword;
    });
  }

  return ts.updateClassDeclaration(
    classNode,
    classNode.decorators,
    modifiers,
    classNode.name,
    classNode.typeParameters,
    updateNativeHostComponentHeritageClauses(classNode, moduleFile),
    updateNativeHostComponentMembers(classNode, transformOpts, moduleFile, cmp)
  );
};


const updateNativeHostComponentHeritageClauses = (classNode: ts.ClassDeclaration, moduleFile: d.Module) => {
  if (classNode.heritageClauses != null && classNode.heritageClauses.length > 0) {
    return classNode.heritageClauses;
  }

  if (moduleFile.cmps.length > 1) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.HTMLElement);
  }

  const heritageClause = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments([],
        ts.createIdentifier(HTML_ELEMENT)
      )
    ]
  );

  return [heritageClause];
};


const updateNativeHostComponentMembers = (classNode: ts.ClassDeclaration, transformOpts: d.TransformOptions, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, moduleFile, cmp, true);
  addNativeConnectedCallback(classMembers, cmp);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addStatictStyle(classMembers, transformOpts, cmp);
  transformHostData(classMembers, moduleFile);

  return classMembers;
};

export const addStatictStyle = (classMembers: ts.ClassElement[], transformOpts: d.TransformOptions, cmp: d.ComponentCompilerMeta) => {
  if (!cmp.hasStyle) {
    return;
  }
  const style = cmp.styles[0];
  if (style == null) {
    return;
  }

  if (typeof style.styleStr === 'string') {
    let styleStr = style.styleStr;

    if (transformOpts.scopeCss && cmp.encapsulation === 'scoped') {
      const scopeId = getScopeId(cmp.tagName);
      styleStr = scopeCss(styleStr, scopeId, false);
    }

    classMembers.push(createStaticGetter('style', ts.createStringLiteral(styleStr)));
  }
};
