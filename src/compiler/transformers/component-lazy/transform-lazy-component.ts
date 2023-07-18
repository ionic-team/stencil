import ts from 'typescript';

import type * as d from '../../../declarations';
import { addImports } from '../add-imports';
import { addLegacyApis } from '../core-runtime-apis';
import { updateStyleImports } from '../style-imports';
import { getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { updateLazyComponentClass } from './lazy-component';

export const lazyComponentTransform = (
  compilerCtx: d.CompilerCtx,
  transformOpts: d.TransformOptions,
): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    return (tsSourceFile) => {
      const styleStatements: ts.Statement[] = [];
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateLazyComponentClass(transformOpts, styleStatements, node, moduleFile, cmp);
          }
        }
        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      if (moduleFile.cmps.length > 0) {
        tsSourceFile = updateStyleImports(transformOpts, tsSourceFile, moduleFile);
      }

      if (moduleFile.isLegacy) {
        addLegacyApis(moduleFile);
      }
      tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      if (styleStatements.length > 0) {
        tsSourceFile = ts.factory.updateSourceFile(tsSourceFile, [...tsSourceFile.statements, ...styleStatements]);
      }

      return tsSourceFile;
    };
  };
};
