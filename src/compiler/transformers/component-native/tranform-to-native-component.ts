import * as d from '../../../declarations';
import { addImports, getComponentMeta, getModuleFromSourceFile, getScriptTarget } from '../transform-utils';
import { addMetadataProxy as addComponentMetaProxy } from '../add-component-meta-proxy';
import { catchError, loadTypeScriptDiagnostics } from '@utils';
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
          tsSourceFile = defineCustomElement(tsSourceFile, moduleFile, transformOpts);
        }

        if (transformOpts.componentMetadata === 'proxy') {
          tsSourceFile = addComponentMetaProxy(tsSourceFile, moduleFile);
        }
      }

      tsSourceFile = addImports(transformCtx, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);

      return tsSourceFile;
    };
  };
};


const defineCustomElement = (tsSourceFile: ts.SourceFile, moduleFile: d.Module, transformOpts: d.TransformOptions) => {
  let statements = tsSourceFile.statements.slice();
  const cmpClassNames = new Set<string>();

  // add customElements.define('cmp-a', CmpClass);
  moduleFile.cmps.forEach(cmpMeta => {
    statements.push(ts.createPropertyAccess(
      ts.createIdentifier('customElements'),
      ts.createCall(
        ts.createIdentifier('define'),
        [],
        [
          ts.createLiteral(cmpMeta.tagName),
          ts.createIdentifier(cmpMeta.componentClassName)
        ]
      ) as any
    ) as any);
    cmpClassNames.add(cmpMeta.componentClassName);
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
