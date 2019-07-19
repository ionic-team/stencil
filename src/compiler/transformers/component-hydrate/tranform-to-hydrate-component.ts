import * as d from '../../../declarations';
import { addImports, getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { updateHydrateComponentClass } from './hydrate-component';
import ts from 'typescript';


export const transformToHydrateComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  try {
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentMetadata: null,
      styleImport: 'inline'
    };
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: getScriptTarget(),
        skipLibCheck: true,
        noResolve: true,
        noLib: true,
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          hydrateComponentTransform(compilerCtx, transformOpts)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError && typeof transpileOutput.outputText === 'string') {
      outputText = transpileOutput.outputText;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return outputText;
};


const hydrateComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateHydrateComponentClass(node, moduleFile, cmp);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      tsSourceFile = addImports(transformCtx, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};
