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

export const isDecoratorNamed = (propName: string) => {
  return (dec: ts.Decorator): boolean => {
    return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName);
  };
};

export const CLASS_DECORATORS_TO_REMOVE = new Set([
  'Component'
]);

export const MEMBER_DECORATORS_TO_REMOVE = new Set([
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch'
]);


export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator): [T];
  <T, T1>(decorator: ts.Decorator): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
