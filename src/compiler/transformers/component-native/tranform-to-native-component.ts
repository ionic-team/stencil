import * as d from '../../../declarations';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { ModuleKind, ScriptTarget, getComponentMeta } from '../transform-utils';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';
import { addNativeImports } from './native-imports';

export function transformToNativeComponentText(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) {
  let outputText: string = null;

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ModuleKind,
        target: ScriptTarget,
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

      tsSourceFile = addNativeImports(transformCtx, compilerCtx, tsSourceFile);
      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
