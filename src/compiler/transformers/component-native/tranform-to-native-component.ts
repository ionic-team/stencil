import * as d from '@declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, addImports, getBuildScriptTarget, getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { registerStyle } from '../register-style';
import { removeStencilImport } from '../remove-stencil-import';
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
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(moduleFile, node);
          if (cmp != null) {
            return updateNativeComponentClass(node, cmp);
          }

        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return removeStencilImport(node as ts.ImportDeclaration);
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      const platformImports = [
        'h',
        'connectedCallback',
        'getElement as __stencil_getElement',
        'getConnect as __stencil_getConnect',
        'getContext as __stencil_getContext',
        'createEvent as __stencil_createEvent',
        'registerHost as __stencil_registerHost',
        'registerStyle as __stencil_registerStyle'
      ];

      tsSourceFile = addImports(transformCtx, tsSourceFile, platformImports, '@stencil/core/platform');

      if (moduleFile != null) {
        tsSourceFile = registerStyle(tsSourceFile, moduleFile.cmps);
      }

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
