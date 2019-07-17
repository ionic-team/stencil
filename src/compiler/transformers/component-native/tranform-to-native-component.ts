import * as d from '../../../declarations';
import { addNativeImports } from './native-imports';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
import { getComponentMeta, getScriptTarget } from '../transform-utils';
import { updateNativeComponentClass } from './native-component';
import ts from 'typescript';


export const transformToNativeComponentText = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta, inputJsText: string) => {
  let outputText: string = null;

  try {
    const transpileOpts: ts.TranspileOptions = {
      compilerOptions: {
        module: ts.ModuleKind.ES2015,
        target: getScriptTarget(),
      },
      fileName: cmp.jsFilePath,
      transformers: {
        after: [
          nativeComponentTransform(compilerCtx, '@stencil/core')
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


export const nativeComponentTransform = (compilerCtx: d.CompilerCtx, coreImportPath: string): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            return updateNativeComponentClass(node, cmp, false);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      tsSourceFile = addNativeImports(transformCtx, compilerCtx, tsSourceFile, coreImportPath);
      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
};


export const customElementDefineTransform = (compilerCtx: d.CompilerCtx, coreImportPath: string): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      const cmps = new Map<string, ts.ClassDeclaration>();
      const cmpClassNames = new Set<string>();

      function visitNode(node: ts.Node): any {
        if (ts.isClassDeclaration(node)) {
          const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
          if (cmp != null) {
            cmps.set(cmp.tagName, node);
            cmpClassNames.add(node.name.text);
            return updateNativeComponentClass(node, cmp, true);
          }
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      tsSourceFile = addNativeImports(transformCtx, compilerCtx, tsSourceFile, coreImportPath);
      tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);

      let statements = tsSourceFile.statements.slice();

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
      });

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

      tsSourceFile = ts.updateSourceFileNode(tsSourceFile, statements);

      return tsSourceFile;
    };
  };
};
