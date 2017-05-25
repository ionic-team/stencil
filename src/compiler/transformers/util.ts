import * as ts from 'typescript';

export function getTextOfPropertyName(name: ts.PropertyName): string {
  switch (name.kind) {
  case ts.SyntaxKind.Identifier:
    return (<ts.Identifier>name).text;
  case ts.SyntaxKind.StringLiteral:
  case ts.SyntaxKind.NumericLiteral:
    return (<ts.LiteralExpression>name).text;
  case ts.SyntaxKind.ComputedPropertyName:
    if (isStringOrNumericLiteral((<ts.ComputedPropertyName>name).expression)) {
      return (<ts.LiteralExpression>(<ts.ComputedPropertyName>name).expression).text;
    }
  }

  return undefined;
}

export function isStringOrNumericLiteral(node: ts.Node): node is ts.StringLiteral | ts.NumericLiteral {
  const kind = node.kind;
  return kind === ts.SyntaxKind.StringLiteral
      || kind === ts.SyntaxKind.NumericLiteral;
}

export type ObjectMap = { [key: string]: any };

export function objectLiteralToObjectMap(objectLiteral: ts.ObjectLiteralExpression): ObjectMap {
  const attrs: ts.ObjectLiteralElementLike[] = objectLiteral.properties;

  return attrs.reduce((final: ObjectMap, attr: ts.PropertyAssignment) => {
    const name = getTextOfPropertyName(attr.name);

    final[name] = true;
    return final;

  }, <ObjectMap>{});
}
