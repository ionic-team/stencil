import type * as d from '../../declarations';
import { convertValueToLiteral } from './transform-utils';
import { DEFINE_CUSTOM_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import { formatComponentRuntimeMeta } from '@utils';
import ts from 'typescript';

export const defineCustomElement = (
  tsSourceFile: ts.SourceFile,
  moduleFile: d.Module,
  transformOpts: d.TransformOptions,
) => {
  let statements = tsSourceFile.statements.slice();

  statements.push(
    ...moduleFile.cmps.map(cmp => {
      return addDefineCustomElement(moduleFile, cmp);
    }),
  );

  if (transformOpts.module === 'cjs') {
    // remove commonjs exports keyword from component classes
    statements = removeComponentCjsExport(statements, moduleFile);
  }

  return ts.updateSourceFileNode(tsSourceFile, statements);
};

const addDefineCustomElement = (moduleFile: d.Module, compilerMeta: d.ComponentCompilerMeta) => {
  if (compilerMeta.isPlain) {
    // add customElements.define('cmp-a', CmpClass);
    return ts.createStatement(
      ts.createCall(
        ts.createPropertyAccess(ts.createIdentifier('customElements'), ts.createIdentifier('define')),
        [],
        [ts.createLiteral(compilerMeta.tagName), ts.createIdentifier(compilerMeta.componentClassName)],
      ),
    );
  }

  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.defineCustomElement);
  const compactMeta: d.ComponentRuntimeMetaCompact = formatComponentRuntimeMeta(compilerMeta, true);

  const liternalCmpClassName = ts.createIdentifier(compilerMeta.componentClassName);
  const liternalMeta = convertValueToLiteral(compactMeta);

  return ts.createStatement(
    ts.createCall(ts.createIdentifier(DEFINE_CUSTOM_ELEMENT), [], [liternalCmpClassName, liternalMeta]),
  );
};

const removeComponentCjsExport = (statements: ts.Statement[], moduleFile: d.Module) => {
  const cmpClassNames = new Set<string>(moduleFile.cmps.map(cmp => cmp.componentClassName));

  return statements.filter(s => {
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
};
