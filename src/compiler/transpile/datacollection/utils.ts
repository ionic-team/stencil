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

export function serializeSymbol(checker: ts.TypeChecker, symbol: ts.Symbol): JSDoc {
  return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
  };
}
