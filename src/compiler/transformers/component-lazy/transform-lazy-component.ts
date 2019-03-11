import * as d from '../../../declarations';
import { addLazyImports } from './lazy-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, getBuildScriptTarget, getComponentMeta } from '../transform-utils';
import { updateLazyComponentClass } from './lazy-component';
import ts from 'typescript';


export function transformToLazyComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, opts: d.TransformOptions, cmp: d.ComponentCompilerMeta, inputText: string) {
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
          lazyComponentTransform(compilerCtx, opts)
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


export function lazyComponentTransform(compilerCtx: d.CompilerCtx, opts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    return tsSourceFile => {

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateLazyComponentClass(opts, node, cmp);
          }

        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      tsSourceFile = addLazyImports(transformCtx, compilerCtx, tsSourceFile);

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
