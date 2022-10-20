import ts from 'typescript';

import type * as d from '../../../declarations';
import { addModuleMetadataProxies } from '../add-component-meta-proxy';
import { addImports } from '../add-imports';
import { addLegacyApis } from '../core-runtime-apis';
import { defineCustomElement } from '../define-custom-element';
import { updateStyleImports } from '../style-imports';
import { getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { updateNativeComponentClass } from './native-component';

export const nativeComponentTransform = (
  compilerCtx: d.CompilerCtx,
  transformOpts: d.TransformOptions
): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    return (tsSourceFile) => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateNativeComponentClass(transformOpts, node, moduleFile, cmp);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      if (moduleFile.cmps.length > 0) {
        if (transformOpts.componentExport === 'customelement') {
          // define custom element, will have no export
          tsSourceFile = defineCustomElement(tsSourceFile, moduleFile, transformOpts);
        } else if (transformOpts.proxy === 'defineproperty') {
          // exporting as a module, but also add the component proxy fn
          tsSourceFile = addModuleMetadataProxies(tsSourceFile, moduleFile);
        }

        tsSourceFile = updateStyleImports(transformOpts, tsSourceFile, moduleFile);
      }

      if (moduleFile.isLegacy) {
        addLegacyApis(moduleFile);
      }
      tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};
