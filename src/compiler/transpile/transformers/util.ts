import { DEFAULT_COMPILER_OPTIONS } from '../compiler-options';
import { ScriptTarget } from '../../transformers/transform-utils';
import ts from 'typescript';


/**
 * Check if class has component decorator
 * @param classNode
 */
export function isComponentClass(classNode: ts.ClassDeclaration) {
  if (!Array.isArray(classNode.decorators)) {
    return false;
  }
  const componentDecoratorIndex = classNode.decorators.findIndex(dec =>
   (ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text === 'Component')
  );
  return (componentDecoratorIndex !== -1);
}


export function isEmptyArgs(arg: any) {
  return arg && arg.kind === ts.SyntaxKind.NumericLiteral && arg.text === '0';
}


export class ObjectMap {
  [key: string]: ts.Expression | ObjectMap
}

export function isInstanceOfObjectMap(object: any): object is ObjectMap {
    return (
      !object.hasOwnProperty('kind') &&
      !object.hasOwnProperty('flags') &&
      !object.hasOwnProperty('pos') &&
      !object.hasOwnProperty('end')
    );
}

function getTextOfPropertyName(name: ts.PropertyName): string {
  switch (name.kind) {
  case ts.SyntaxKind.Identifier:
    return (<ts.Identifier>name).text;
  case ts.SyntaxKind.StringLiteral:
  case ts.SyntaxKind.NumericLiteral:
    return (<ts.LiteralExpression>name).text;
  case ts.SyntaxKind.ComputedPropertyName:
    const expression = (<ts.ComputedPropertyName>name).expression;
    if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
      return (<ts.LiteralExpression>(<ts.ComputedPropertyName>name).expression).text;
    }
  }
  return undefined;
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
    const value = objMap[key];

    if (!ts.isIdentifier(value) && isInstanceOfObjectMap(value)) {
      return ts.createPropertyAssignment(ts.createLiteral(key), objectMapToObjectLiteral(value));
    }
    return ts.createPropertyAssignment(ts.createLiteral(key), value as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties);
}

/**
 * Convert a js value into typescript AST
 * @param val array, object, string, boolean, or number
 * @returns Typescript Object Literal, Array Literal, String Literal, Boolean Literal, Numeric Literal
 */
export function convertValueToLiteral(val: any) {
  if (val === String) {
    return ts.createIdentifier('String');
  }
  if (val === Number) {
    return ts.createIdentifier('Number');
  }
  if (val === Boolean) {
    return ts.createIdentifier('Boolean');
  }
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
  if (Object.keys(obj).length === 0) {
    return ts.createObjectLiteral([]);
  }
  const newProperties: ts.ObjectLiteralElementLike[] = Object.keys(obj).map((key: string): ts.ObjectLiteralElementLike => {
    return ts.createPropertyAssignment(ts.createLiteral(key), convertValueToLiteral(obj[key]) as ts.Expression);
  });

  return ts.createObjectLiteral(newProperties, true);
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

/**
 * Execute an array of transforms over a string containing typescript source
 * @param sourceText Typescript source as a string
 * @param transformers Array of transforms to run agains the source string
 * @returns a string
 */
export async function transformSourceString(fileName: string, sourceText: string, transformers: ts.TransformerFactory<ts.SourceFile>[]) {
  const transformed = ts.transform(ts.createSourceFile(fileName, sourceText, ScriptTarget), transformers);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }, {
      onEmitNode: transformed.emitNodeWithNotification,
      substituteNode: transformed.substituteNode
  });
  const result = printer.printBundle(ts.createBundle(transformed.transformed));
  transformed.dispose();

  return result;
}

/**
 * Execute transforms over a string containing typescript source
 * @param sourceText Typescript source as a string
 * @param transformers Object containing before and after transforms to run against the source string
 * @returns a string
 */
export function transformSourceFile(sourceText: string, transformers: ts.CustomTransformers) {
  return ts.transpileModule(sourceText, {
    transformers,
    compilerOptions: Object.assign({}, DEFAULT_COMPILER_OPTIONS, {
      target: ScriptTarget
    })
  }).outputText;
}
