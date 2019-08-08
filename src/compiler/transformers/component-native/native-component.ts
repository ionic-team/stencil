import * as d from '../../../declarations';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { addWatchers } from '../watcher-meta-transform';
import { createStaticGetter } from '../transform-utils';
import { getStyleImportPath } from '../static-to-meta/styles';
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

  const heritageClause = ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments([],
        ts.createIdentifier(HTML_ELEMENT)
      )
    ]
  );

  return [heritageClause];
};


const updateNativeHostComponentMembers = (transformOpts: d.TransformOptions, classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, moduleFile, cmp, true);
  addNativeConnectedCallback(classMembers, cmp);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addStaticStyle(transformOpts, classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  return classMembers;
};

export const addStaticStyle = (transformOpts: d.TransformOptions, classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (!cmp.hasStyle) {
    return;
  }
  const style = cmp.styles[0];
  if (style == null) {
    return;
  }

  if (typeof style.styleStr === 'string') {
    classMembers.push(createStaticGetter('style', ts.createStringLiteral(style.styleStr)));

  } else if (typeof style.styleIdentifier === 'string') {
    let rtnExpr: ts.Expression;

    if (transformOpts.module === ts.ModuleKind.CommonJS && style.externalStyles.length > 0) {
      const importPath = getStyleImportPath(style);

      rtnExpr = ts.createCall(
        ts.createIdentifier('require'),
        undefined,
        [ ts.createStringLiteral(importPath) ]
      );

    } else {
      rtnExpr = ts.createIdentifier(style.styleIdentifier);
    }
    classMembers.push(createStaticGetter('style', rtnExpr));
  }
};
