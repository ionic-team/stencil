import ts from 'typescript';

export const hasFormAssociated = (statements: ts.NodeArray<ts.Statement>) => {
  return !!statements.find(
    (st: ts.ExpressionStatement) =>
      st.kind === ts.SyntaxKind.ExpressionStatement &&
      st.expression &&
      st.expression.kind === ts.SyntaxKind.BinaryExpression &&
      (st.expression as ts.BinaryExpression).left.kind === ts.SyntaxKind.PropertyAccessExpression &&
      ((st.expression as ts.BinaryExpression).left as ts.PropertyAccessExpression).name.getText() ===
        'formAssociated' &&
      (st.expression as ts.BinaryExpression).right.kind === ts.SyntaxKind.TrueKeyword
  );
};
