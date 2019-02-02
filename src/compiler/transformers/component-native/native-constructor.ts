import ts from 'typescript';


export function updateNativeConstructor(classMembers: ts.ClassElement[]) {
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    const before: ts.Statement[] = [];

    const hasSuper = cstrMethod.body.statements.some(s => s.kind === ts.SyntaxKind.SuperKeyword);
    if (!hasSuper) {
      before.push(createSuper());
    }

    const body = ts.updateBlock(cstrMethod.body, [
      ...before,
      nativeRegisterHostStatement(),
      ...cstrMethod.body.statements,
    ]);

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethod.parameters,
      body
    );

  } else {
    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      undefined,
      ts.createBlock([
        createSuper(),
        nativeRegisterHostStatement(),
      ], true)
    );
    classMembers.unshift(cstrMethod);
  }
}


function nativeRegisterHostStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier('__stencil_registerHost'),
    undefined,
    [ ts.createThis() ]
  ));
}


function createSuper() {
  return ts.createExpressionStatement(ts.createCall(
    ts.createIdentifier('super'),
    undefined,
    undefined
  ));
}
