import * as d from '../../../declarations';
import { addImports } from '../add-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { updateHydrateComponentClass } from './hydrate-component';
import ts from 'typescript';
import { addLegacyApis } from '../core-runtime-apis';


export const transformToHydrateComponentText = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  try {
    const tsCompilerOptions: ts.CompilerOptions = {
      module: ts.ModuleKind.ESNext,
      target: getScriptTarget(),
      skipLibCheck: true,
      noResolve: true,
      noLib: true,
    };
    const transformOpts: d.TransformOptions = {
      coreImportPath: '@stencil/core',
      componentExport: null,
      componentMetadata: null,
      currentDirectory: config.cwd,
      proxy: null,
      style: 'static',
    };
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: tsCompilerOptions,
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          hydrateComponentTransform(compilerCtx, transformOpts)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputJsText, transpileOpts);

    buildCtx.diagnostics.push(
      ...loadTypeScriptDiagnostics(transpileOutput.diagnostics)
    );

    if (!buildCtx.hasError && typeof transpileOutput.outputText === 'string') {
      outputText = transpileOutput.outputText;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return outputText;
};


export const hydrateComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {

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

      if (moduleFile.isLegacy) {
        addLegacyApis(moduleFile);
      }
      tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};
