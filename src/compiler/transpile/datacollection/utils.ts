import { JSDoc } from '../../../util/interfaces';
import * as ts from 'typescript';

export function evalText(text: string) {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
}

export interface GetDeclarationParameters {
  <T>(decorator: ts.Decorator): [T];
  <T, T1>(decorator: ts.Decorator): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
export const getDeclarationParameters: GetDeclarationParameters = (decorator: ts.Decorator): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }

  return decorator.expression.arguments.map((arg) => {
    return evalText(arg.getText().trim());
  });
};

export function isPropertyWithDecorators(member: ts.ClassElement): boolean {
  return ts.isPropertyDeclaration(member)
    && Array.isArray(member.decorators)
    && member.decorators.length > 0;
}

export function isDecoratorNamed(name: string) {
  return (dec: ts.Decorator): boolean => {
    return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name);
  };
}

export function isMethodWithDecorators(member: ts.ClassElement): boolean {
  return ts.isMethodDeclaration(member)
    && Array.isArray(member.decorators)
    && member.decorators.length > 0;
}

export function serializeSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): JSDoc {
  return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
  };
}
