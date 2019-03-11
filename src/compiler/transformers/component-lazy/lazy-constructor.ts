import * as d from '../../../declarations';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';
import ts from 'typescript';
import { REGISTER_INSTANCE } from '../exports';


export function updateLazyComponentConstructor(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
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
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    const body = ts.updateBlock(cstrMethod.body, [
      registerInstanceStatement(),
      ...cstrMethod.body.statements,
      ...addCreateEvents(cmp),
      ...addLegacyProps(cmp)
    ]);

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethodArgs,
      body,
    );

  } else {
    // create a constructor()
    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      cstrMethodArgs,
      ts.createBlock([
        registerInstanceStatement(),
        ...addCreateEvents(cmp),
        ...addLegacyProps(cmp)
      ], true),
    );
    classMembers.unshift(cstrMethod);
  }
}


function registerInstanceStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier(REGISTER_INSTANCE),
    undefined,
    [
      ts.createThis(),
      ts.createIdentifier(HOST_REF_ARG)
    ]
  ));
}


const HOST_REF_ARG = 'hostRef';
