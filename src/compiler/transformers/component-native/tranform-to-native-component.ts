import * as d from '../../../declarations';
import { addImports } from '../add-imports';
import { addLegacyApis } from '../core-runtime-apis';
import { addModuleMetadataProxies } from '../add-component-meta-proxy';
import { getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { defineCustomElement } from '../define-custom-element';
import { updateNativeComponentClass } from './native-component';
import { updateStyleImports } from '../style-imports';
import ts from 'typescript';


export const transformToNativeComponentText = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  try {
    const tsCompilerOptions: ts.CompilerOptions = {
      module: ts.ModuleKind.ESNext,
      target: getScriptTarget(),
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
          nativeComponentTransform(compilerCtx, transformOpts)
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


export const nativeComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {
  return transformCtx => {

    return tsSourceFile => {
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
