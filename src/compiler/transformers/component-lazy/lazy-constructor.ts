import ts from 'typescript';


export function updateLazyComponentConstructor(classMembers: ts.ClassElement[]) {
  const cstrMethodArgs = [
    ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createIdentifier(HOST_REF_ARG)
    )
  ];

  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);
  if (cstrMethodIndex >= 0) {
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;
    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethodArgs,
      cstrMethod.body,
    );

  } else {
    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      cstrMethodArgs,
      ts.createBlock([
        registerInstanceStatement()
      ], true),
    );
    classMembers.unshift(cstrMethod);
  }
}


function registerInstanceStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier('__stencil_registerInstance'),
    undefined,
    [
      ts.createThis(),
      ts.createIdentifier(HOST_REF_ARG)
    ]
  ));
}


const HOST_REF_ARG = 'hostRef';
