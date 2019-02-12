import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, getComponentMeta } from '../transform-utils';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';


export function transformToNativeComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  if (buildCtx.shouldAbort) {
    return null;
  }

  let outputText: string = null;

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ModuleKind,
        target: getBuildScriptTarget(build)
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          nativeComponentTransform(compilerCtx)
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
}


function nativeComponentTransform(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    return tsSourceFile => {
      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateNativeComponentClass(node, cmp);
          }

        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      const platformImports = [
        'connectedCallback',
        'getElement as __stencil_getElement',
        'getConnect as __stencil_getConnect',
        'getContext as __stencil_getContext',
        'createEvent as __stencil_createEvent',
        'registerHost as __stencil_registerHost',
        'h as __stencil_h',
      ];

      tsSourceFile = addImports(transformCtx, tsSourceFile, platformImports, '@stencil/core/platform');

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
