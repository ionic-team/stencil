import * as d from '@declarations';
import { addCreateEvents } from '../create-event';
import ts from 'typescript';
import { REGISTER_HOST } from '../exports';


export function updateNativeConstructor(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, build: d.Build, ensureSuper: boolean) {
  if (!build.lifecycle && !build.updatable && !build.style) {
    return;
  }
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    let statements: ts.Statement[] = [
      nativeRegisterHostStatement(),
      ...cstrMethod.body.statements,
      ...addCreateEvents(cmp)
    ];

    if (ensureSuper) {
      const hasSuper = cstrMethod.body.statements.some(s => s.kind === ts.SyntaxKind.SuperKeyword);
      if (!hasSuper) {
        statements = [
          createSuper(),
          ...statements
        ];
      }
    }

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethod.parameters,
      ts.updateBlock(cstrMethod.body, statements)
    );

  } else {
    // create a constructor()
    let statements: ts.Statement[] = [
      nativeRegisterHostStatement(),
      ...addCreateEvents(cmp)
    ];

    if (ensureSuper) {
      statements = [
        createSuper(),
        ...statements
      ];
    }

    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      undefined,
      ts.createBlock(statements, true)
    );
    classMembers.unshift(cstrMethod);
  }
}


function nativeRegisterHostStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier(REGISTER_HOST),
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
