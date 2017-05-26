import * as ts from 'typescript';

export class ObjectMap {
  [key: string]: ts.Expression | ObjectMap
}

export function isInstanceOfObjectMap(object: any): object is ObjectMap {
  return !object.hasOwnProperty('kind') &&
    !object.hasOwnProperty('flags') &&
    !object.hasOwnProperty('pos') &&
    !object.hasOwnProperty('end');
}

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



export function objectLiteralToObjectMap(objectLiteral: ts.ObjectLiteralExpression): ObjectMap {
  const attrs: ts.ObjectLiteralElementLike[] = objectLiteral.properties;

  return attrs.reduce((final: ObjectMap, attr: ts.PropertyAssignment) => {
    const name = getTextOfPropertyName(attr.name);
    let val: any;

    switch (attr.initializer.kind) {
    case ts.SyntaxKind.ObjectLiteralExpression:
      val = objectLiteralToObjectMap(attr.initializer as ts.ObjectLiteralExpression);
      break;
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.PropertyAccessExpression:
    default:
      val = attr.initializer;
    }

    final[name] = val;
    return final;

  }, <ObjectMap>{});
}

export function objectMapToObjectLiteral(objMap: ObjectMap): ts.ObjectLiteralExpression {
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(objMap).map((key: string): ts.ObjectLiteralElementLike => {
    let value = objMap[key];

    if (isInstanceOfObjectMap(value)) {
      return ts.createPropertyAssignment(ts.createLiteral(key), objectMapToObjectLiteral(value));
    }
    return ts.createPropertyAssignment(ts.createLiteral(key), value as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties);
}
