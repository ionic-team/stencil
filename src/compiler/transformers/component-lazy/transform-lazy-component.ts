import * as d from '../../../declarations';
import { addImports } from '../add-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { updateLazyComponentClass } from './lazy-component';
import ts from 'typescript';
import { addLegacyApis } from '../core-runtime-apis';


export const transformToLazyComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, transformOpts: d.TransformOptions, cmp: d.ComponentCompilerMeta, inputText: string) => {
  let outputText: string = null;

  try {
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
          lazyComponentTransform(compilerCtx, transformOpts)
        ]
      }
    };

    const transpileOutput = ts.transpileModule(inputText, transpileOpts);

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


export const lazyComponentTransform = (compilerCtx: d.CompilerCtx, transformOpts: d.TransformOptions): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateLazyComponentClass(transformOpts, node, moduleFile, cmp);
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
