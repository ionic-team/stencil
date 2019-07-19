import * as d from '../../../declarations';
import { addImports, getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { addModuleMetadataProxies } from '../add-component-meta-proxy';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { defineCustomElement } from '../define-custom-element';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';


export const transformToNativeComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentMetadata: null
  };

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: getScriptTarget(),
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          nativeComponentTransform(compilerCtx, transformOpts)
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


export const nativeComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {
  const exportAsCustomElement = (transformOpts.componentExport === 'customelement');

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateNativeComponentClass(node, moduleFile, cmp, exportAsCustomElement);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      if (moduleFile.cmps.length > 0) {
        if (exportAsCustomElement) {
          // define custom element, and remove "export" from components
          tsSourceFile = defineCustomElement(tsSourceFile, moduleFile, transformOpts);

        } else if (transformOpts.componentMetadata === 'proxy') {
          // exporting as a module, but also add the component proxy fn
          tsSourceFile = addModuleMetadataProxies(tsSourceFile, moduleFile);
        }
      }

      tsSourceFile = addImports(transformCtx, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};
