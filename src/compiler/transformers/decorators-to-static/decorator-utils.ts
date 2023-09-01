import ts from 'typescript';

import { objectLiteralToObjectMap } from '../transform-utils';
import type { StencilDecorator } from './decorators-constants';

export const getDeclarationParameters: GetDeclarationParameters = (
  decorator: ts.Decorator,
  typeChecker: ts.TypeChecker,
): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }
  return decorator.expression.arguments.map((arg) => getDeclarationParameter(arg, typeChecker));
};

const getDeclarationParameter = (arg: ts.Expression, typeChecker: ts.TypeChecker): any => {
  if (ts.isObjectLiteralExpression(arg)) {
    return objectLiteralToObjectMap(arg);
  } else if (ts.isStringLiteral(arg)) {
    return arg.text;
  } else if (ts.isPropertyAccessExpression(arg)) {
    const type = typeChecker.getTypeAtLocation(arg);
    if (type !== undefined && type.isLiteral()) {
      /**
       * Enum members are property access expressions, so we can evaluate them
       * to get the enum member value as a string.
       *
       * This enables developers to use enum members in decorators.
       * e.g. @Watch(MyEnum.VALUE)
       */
      return type.value;
    }
  }

  throw new Error(`invalid decorator argument: ${arg.getText()}`);
};

/**
 * Returns a function that checks if a decorator:
 * - is a call expression. these are decorators that are immediately followed by open/close parenthesis with optional
 *   arg(s), e.g. `@Prop()`
 * - the name of the decorator matches the provided `propName`
 *
 * @param propName the name of the decorator to match against
 * @returns true if the conditions above are both true, false otherwise
 */
export const isDecoratorNamed = (propName: StencilDecorator) => {
  return (dec: ts.Decorator): boolean => {
    return ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName;
  };
};

export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T];
  <T, T1>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1, T2];
}
