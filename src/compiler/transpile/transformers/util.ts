import * as ts from 'typescript';


export function removeClassDecorator(classNode: ts.ClassDeclaration) {
  return ts.createClassDeclaration(
      undefined!, // <-- that's what's removing the decorator

      // everything else should be the same
      classNode.modifiers!,
      classNode.name!,
      classNode.typeParameters!,
      classNode.heritageClauses!,
      classNode.members);
}


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
  return kind === ts.SyntaxKind.StringLiteral || kind === ts.SyntaxKind.NumericLiteral;
}


export function objectLiteralToObjectMap(objectLiteral: ts.ObjectLiteralExpression): ObjectMap {
  const attrs: ts.ObjectLiteralElementLike[] = (objectLiteral.properties as any);

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

export function objectMapToObjectLiteral(objMap: any): ts.ObjectLiteralExpression {
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(objMap).map((key: string): ts.ObjectLiteralElementLike => {
    let value = objMap[key];

    if (isInstanceOfObjectMap(value)) {
      return ts.createPropertyAssignment(ts.createLiteral(key), objectMapToObjectLiteral(value));
    }
    return ts.createPropertyAssignment(ts.createLiteral(key), value as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties);
}


export function isEmptyArgs(arg: any) {
  return arg && arg.kind === ts.SyntaxKind.NumericLiteral && arg.text === '0';
}


/**
 * Convert a js value into typescript AST
 * @param val array, object, string, boolean, or number
 * @returns Typescript Object Literal, Array Literal, String Literal, Boolean Literal, Numeric Literal
 */
export function convertValueToLiteral(val: any) {
  if (Array.isArray(val)) {
    return arrayToArrayLiteral(val);
  }
  if (typeof val === 'object') {
    return objectToObjectLiteral(val);
  }
  return ts.createLiteral(val);
}

/**
 * Convert a js object into typescript AST
 * @param obj key value object
 * @returns Typescript Object Literal Expression
 */
function objectToObjectLiteral(obj: { [key: string]: any }): ts.ObjectLiteralExpression {
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map((key: string): ts.ObjectLiteralElementLike => {
    return ts.createPropertyAssignment(ts.createLiteral(key), convertValueToLiteral(obj[key]) as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties);
}

/**
 * Convert a js array into typescript AST
 * @param list array
 * @returns Typescript Array Literal Expression
 */
function arrayToArrayLiteral(list: any[]): ts.ArrayLiteralExpression {
  const newList: any[] = list.map(convertValueToLiteral);
  return ts.createArrayLiteral(newList);
}
