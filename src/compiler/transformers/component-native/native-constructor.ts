import * as d from '../../../declarations';
import { addCreateEvents } from '../create-event';
import ts from 'typescript';
import { ATTACH_SHADOW, REGISTER_HOST } from '../exports';
import { addLegacyProps } from '../legacy-props';


export function updateNativeConstructor(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, ensureSuper: boolean) {
  if (cmp.isPlain) {
    return;
  }
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    let statements: ts.Statement[] = [
      ...nativeInit(cmp),
      ...cstrMethod.body.statements,
      ...addCreateEvents(cmp),
      ...addLegacyProps(cmp)
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
      ...nativeInit(cmp),
      ...addCreateEvents(cmp),
      ...addLegacyProps(cmp),
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


function nativeInit(cmp: d.ComponentCompilerMeta) {
  const initStatements =  [
    nativeRegisterHostStatement(),
  ];
  if (cmp.encapsulation === 'shadow') {
    initStatements.push(nativeAttachShadowStatement());
  }
  return initStatements;
}

function nativeRegisterHostStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier(REGISTER_HOST),
    undefined,
    [ ts.createThis() ]
  ));
}

function nativeAttachShadowStatement() {
  return ts.createStatement(ts.createCall(
    ts.createIdentifier(ATTACH_SHADOW),
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
