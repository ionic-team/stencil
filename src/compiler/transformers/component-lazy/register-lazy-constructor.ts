import ts from 'typescript';


export function registerLazyComponentInConstructor(classMembers: ts.ClassElement[]) {
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  const cstrMethodArgs: any = [
    ts.createIdentifier('elmData')
  ];

  const registerLazyInstanceMethodArgs: any = [
    ts.createThis(),
    ts.createIdentifier('elmData')
  ];

  const registerLazyInstanceMethod = ts.createCall(
    ts.createIdentifier(REGISTER_INSTANCE_METHOD),
    undefined,
    registerLazyInstanceMethodArgs
  );

  if (cstrMethodIndex > -1) {
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethodArgs,
      ts.updateBlock(cstrMethod.body, [
        ts.createExpressionStatement(registerLazyInstanceMethod),
        ...cstrMethod.body.statements
      ])
    );

  } else {
    const body = ts.createBlock([
      ts.createExpressionStatement(registerLazyInstanceMethod)
    ], true);

    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      cstrMethodArgs,
      body
    );
    classMembers.unshift(cstrMethod);
  }
}


export const REGISTER_INSTANCE_METHOD = `registerLazyInstance`;
