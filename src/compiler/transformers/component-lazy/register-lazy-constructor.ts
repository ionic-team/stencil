import ts from 'typescript';


export function registerLazyComponentInConstructor(classMembers: ts.ClassElement[]) {
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  const cstrMethodArgs: any = [
    ts.createIdentifier('elmData')
  ];

  const registerInstanceMethodArgs: any = [
    ts.createThis(),
    ts.createIdentifier('elmData')
  ];

  const registerInstanceMethod = ts.createCall(
    ts.createIdentifier('registerInstance'),
    undefined,
    registerInstanceMethodArgs
  );

  if (cstrMethodIndex > -1) {
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethodArgs,
      ts.updateBlock(cstrMethod.body, [
        ts.createExpressionStatement(registerInstanceMethod),
        ...cstrMethod.body.statements
      ])
    );

  } else {
    const body = ts.createBlock([
      ts.createExpressionStatement(registerInstanceMethod)
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
