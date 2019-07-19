import ts from 'typescript';


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


const evalText = (text: string) => {
  const fnStr = `return ${text};`;
  return new Function(fnStr)();
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
