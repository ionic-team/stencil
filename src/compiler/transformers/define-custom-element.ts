import * as d from '../../declarations';
import { convertValueToLiteral } from './transform-utils';
import { DEFINE_CUSTOM_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import { formatComponentRuntimeMeta } from '../app-core/format-component-runtime-meta';
import ts from 'typescript';


export const defineCustomElement = (tsSourceFile: ts.SourceFile, moduleFile: d.Module, transformOpts: d.TransformOptions) => {
  let statements = tsSourceFile.statements.slice();

  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.defineCustomElement);

  moduleFile.cmps.forEach(compilerMeta => {
    addDefineCustomElement(statements, compilerMeta);
  });

  if (transformOpts.module === ts.ModuleKind.CommonJS) {
    // remove commonjs exports keyword from component classes
    const cmpClassNames = new Set<string>(
      moduleFile.cmps.map(cmp => cmp.componentClassName)
    );

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


const addDefineCustomElement = (statements: ts.Statement[], compilerMeta: d.ComponentCompilerMeta) => {
  // TODO! SIMPLE CASE THAT DOESN'T REQUIRE THE COMPONENT TO BE PROXIED
  // add customElements.define('cmp-a', CmpClass);
  // moduleFile.cmps.forEach(cmpMeta => {
  //   statements.push(ts.createPropertyAccess(
  //     ts.createIdentifier('customElements'),
  //     ts.createCall(
  //       ts.createIdentifier('define'),
  //       [],
  //       [
  //         ts.createLiteral(cmpMeta.tagName),
  //         ts.createIdentifier(cmpMeta.componentClassName)
  //       ]
  //     ) as any
  //   ) as any);
  //   cmpClassNames.add(cmpMeta.componentClassName);

  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(compilerMeta, true);

  const liternalCmpClassName = ts.createIdentifier(compilerMeta.componentClassName);
  const liternalMeta = convertValueToLiteral(compactMeta);

  const proxyFn = ts.createStatement(
    ts.createCall(
      ts.createIdentifier(DEFINE_CUSTOM_ELEMENT),
      [],
      [
        liternalCmpClassName,
        liternalMeta
      ]
    )
  );

  statements.push(proxyFn);
};
