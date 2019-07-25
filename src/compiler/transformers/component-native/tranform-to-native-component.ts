import * as d from '../../../declarations';
import { addImports } from '../add-imports';
import { addModuleMetadataProxies } from '../add-component-meta-proxy';
import { addStyleImports } from '../static-to-meta/styles';
import { getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { defineCustomElement } from '../define-custom-element';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';
import { addLegacyImports } from '../core-runtime-apis';


export const transformToNativeComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    componentExport: null,
    componentMetadata: null,
    scopeCss: false,
    style: 'inline'
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
            return updateNativeComponentClass(transformOpts, node, moduleFile, cmp, exportAsCustomElement);
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

        if (transformOpts.style === 'import') {
          tsSourceFile = addStyleImports(transformOpts, tsSourceFile, moduleFile);
        }
      }

      if (moduleFile.isLegacy) {
        addLegacyImports(moduleFile);
      }
      tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};
