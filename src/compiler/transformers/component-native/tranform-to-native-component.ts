import * as d from '../../../declarations';
import { addNativeImports } from './native-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { getComponentMeta, getScriptTarget } from '../transform-utils';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';


export const transformToNativeComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  const transformOpts: d.TransformOptions = {
    coreImportPath: '@stencil/core',
    metadata: null
  };

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ES2015,
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
  const exportAsCustomElement = (transformOpts.transformOutput === 'customelement');

  return transformCtx => {

    return tsSourceFile => {
      const cmps = new Map<string, ts.ClassDeclaration>();

      const visitNode = (node: ts.Node): any => {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            cmps.set(cmp.tagName, node);
            return updateNativeComponentClass(node, cmp, exportAsCustomElement);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      tsSourceFile = addNativeImports(transformCtx, compilerCtx, tsSourceFile, transformOpts.coreImportPath);
      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      if (exportAsCustomElement) {
        tsSourceFile = defineCustomElement(tsSourceFile, cmps, transformOpts);
      }

      return tsSourceFile;
    };
  };
};


const defineCustomElement = (tsSourceFile: ts.SourceFile, cmps: Map<string, ts.ClassDeclaration>, transformOpts: d.TransformOptions) => {
  let statements = tsSourceFile.statements.slice();
  const cmpClassNames = new Set<string>();

  // add customElements.define('cmp-a', CmpClass);
  cmps.forEach((cmpNode, tagName) => {
    statements.push(ts.createPropertyAccess(
      ts.createIdentifier('customElements'),
      ts.createCall(
        ts.createIdentifier('define'),
        [],
        [
          ts.createLiteral(tagName),
          ts.createIdentifier(cmpNode.name.text)
        ]
      ) as any
    ) as any);
    cmpClassNames.add(cmpNode.name.text);
  });

  if (transformOpts.module === ts.ModuleKind.CommonJS) {
    // remove commonjs exports keyword from component classes
    statements = statements.filter(s => {
      if (s.kind === ts.SyntaxKind.ExpressionStatement) {
        const exp = (s as ts.ExpressionStatement).expression as ts.BinaryExpression;
        if (exp && exp.kind === ts.SyntaxKind.BinaryExpression) {
          const left = exp.left as ts.PropertyAccessExpression;
          if (left && left.kind === ts.SyntaxKind.PropertyAccessExpression) {
            if (left.expression && left.expression.kind === ts.SyntaxKind.Identifier) {
              const leftText = left.expression as ts.Identifier;
              if (leftText.text === 'exports') {
                const right = exp.right as ts.Identifier;
                if (right && cmpClassNames.has(right.text)) {
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    });
  }

  return ts.updateSourceFileNode(tsSourceFile, statements);
};
