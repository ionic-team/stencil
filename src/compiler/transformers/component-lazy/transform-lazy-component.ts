import * as d from '@declarations';
import { addLazyImports } from './lazy-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, getBuildScriptTarget, getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { removeStencilImport } from '../remove-stencil-import';
import { updateLazyComponentClass } from './lazy-component';
import ts from 'typescript';


export function transformToLazyComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta, inputText: string) {
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
          lazyComponentTransform(compilerCtx)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputText, transpileOpts);

    loadTypeScriptDiagnostics(buildCtx.diagnostics, transpileOutput.diagnostics);

    if (!buildCtx.hasError && typeof transpileOutput.outputText === 'string') {
      outputText = transpileOutput.outputText;
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  return outputText;
}


export function lazyComponentTransform(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(moduleFile, node);
          if (cmp != null) {
            return updateLazyComponentClass(node, cmp);
          }

        } else if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return removeStencilImport(node as ts.ImportDeclaration);
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      tsSourceFile = addLazyImports(transformCtx, tsSourceFile);

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
