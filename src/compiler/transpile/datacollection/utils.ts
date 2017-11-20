import * as ts from 'typescript';

export function evalText(text: string) {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
}

export function getDeclarationParameters(decorator: ts.Decorator): any[] {
  if (ts.isCallExpression(decorator.expression) && Array.isArray(decorator.expression.arguments)) {
    return decorator.expression.arguments.map(arg => {
      return evalText(arg.getText().trim());
    });
  }

  return [];
}
