import * as d from '../../../declarations';
import { addNativeConnectedCallback } from './native-connected-callback';
import { addNativeElementGetter } from './native-element-getter';
import { addWatchers } from '../watcher-meta-transform';
import { createStaticGetter } from '../transform-utils';
import { HTML_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import { removeStaticMetaProperties } from '../remove-static-meta-properties';
import { transformHostData } from '../host-data-transform';
import { updateNativeConstructor } from './native-constructor';
import ts from 'typescript';


export const updateNativeComponentClass = (classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta, removeExport: boolean) => {
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
    updateNativeHostComponentMembers(classNode, moduleFile, cmp)
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


const updateNativeHostComponentMembers = (classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const classMembers = removeStaticMetaProperties(classNode);

  updateNativeConstructor(classMembers, moduleFile, cmp, true);
  addNativeConnectedCallback(classMembers, cmp);
  addNativeElementGetter(classMembers, cmp);
  addWatchers(classMembers, cmp);
  addComponentStyle(classMembers, cmp);
  transformHostData(classMembers, moduleFile);

  return classMembers;
};

export const addComponentStyle = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  if (!cmp.hasStyle) {
    return;
  }
  const style = cmp.styles[0];
  if (style == null || style.compiledStyleText == null) {
    console.log(cmp);
  }
  classMembers.push(createStaticGetter('style', ts.createStringLiteral(style.compiledStyleText)));
};
