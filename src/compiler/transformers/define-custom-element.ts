import * as d from '../../declarations';
import ts from 'typescript';


export const defineCustomElement = (tsSourceFile: ts.SourceFile, moduleFile: d.Module, transformOpts: d.TransformOptions) => {
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
