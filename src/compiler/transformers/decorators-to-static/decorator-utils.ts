import { objectLiteralToObjectMap } from '../transform-utils';
import ts from 'typescript';

export const getDeclarationParameters: GetDeclarationParameters = (decorator: ts.Decorator): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }
  return decorator.expression.arguments.map(getDeclarationParameter);
};

const getDeclarationParameter = (arg: ts.Expression): any => {
  if (ts.isObjectLiteralExpression(arg)) {
    return objectLiteralToObjectMap(arg);
  } else if (ts.isStringLiteral(arg)) {
    return arg.text;
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
export const isDecoratorNamed = (propName: string) => {
  return (dec: ts.Decorator): boolean => {
    return ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName;
  };
};

export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator): [T];
  <T, T1>(decorator: ts.Decorator): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
