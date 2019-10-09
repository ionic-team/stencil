import * as d from '../../../declarations';
import { addImports } from '../../../compiler/transformers/add-imports';
import { addLegacyApis } from '../../../compiler/transformers/core-runtime-apis';
import { getComponentMeta, getModuleFromSourceFile } from '../../../compiler/transformers/transform-utils';
import { updateLazyComponentClass } from './lazy-component';
import { updateStyleImports } from '../../../compiler/transformers/style-imports';
import ts from 'typescript';


export const lazyComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            node = updateLazyComponentClass(transformOpts, node, moduleFile, cmp);
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

      return tsSourceFile;
    };
  };
};
