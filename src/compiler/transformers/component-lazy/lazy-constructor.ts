import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, REGISTER_INSTANCE, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';
import { retrieveTsModifiers } from '../transform-utils';

export const updateLazyComponentConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
) => {
  const cstrMethodArgs = [
    ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier(HOST_REF_ARG)),
  ];

  const cstrMethodIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);
  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    const body = ts.factory.updateBlock(cstrMethod.body, [
      registerInstanceStatement(moduleFile),
      ...addCreateEvents(moduleFile, cmp),
      ...cstrMethod.body.statements,
      ...addLegacyProps(moduleFile, cmp),
    ]);

    classMembers[cstrMethodIndex] = ts.factory.updateConstructorDeclaration(
      cstrMethod,
      retrieveTsModifiers(cstrMethod),
      cstrMethodArgs,
      body
    );
  } else {
    // create a constructor()
    const cstrMethod = ts.factory.createConstructorDeclaration(
      undefined,
      cstrMethodArgs,
      ts.factory.createBlock(
        [
          registerInstanceStatement(moduleFile),
          ...addCreateEvents(moduleFile, cmp),
          ...addLegacyProps(moduleFile, cmp),
        ],
        true
      )
    );
    classMembers.unshift(cstrMethod);
  }
};

const registerInstanceStatement = (moduleFile: d.Module) => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.registerInstance);

  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createIdentifier(REGISTER_INSTANCE), undefined, [
      ts.factory.createThis(),
      ts.factory.createIdentifier(HOST_REF_ARG),
    ])
  );
};

const HOST_REF_ARG = 'hostRef';
