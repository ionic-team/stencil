import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, REGISTER_INSTANCE, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { retrieveTsModifiers } from '../transform-utils';

/**
 * Update the constructor for a Stencil component's class in order to prepare
 * it for lazy-build duty (i.e. to take over a bootstrapped component)
 *
 * @param classMembers an out param of class members for the component
 * @param moduleFile information about the component's home module
 * @param cmp compiler metadata about the component
 */
export const updateLazyComponentConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
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
    ]);

    classMembers[cstrMethodIndex] = ts.factory.updateConstructorDeclaration(
      cstrMethod,
      retrieveTsModifiers(cstrMethod),
      cstrMethodArgs,
      body,
    );
  } else {
    // create a constructor()
    const cstrMethod = ts.factory.createConstructorDeclaration(
      undefined,
      cstrMethodArgs,
      ts.factory.createBlock([registerInstanceStatement(moduleFile), ...addCreateEvents(moduleFile, cmp)], true),
    );
    classMembers.unshift(cstrMethod);
  }
};

/**
 * Create a statement containing an expression calling the `registerInstance`
 * helper with the {@link d.HostRef} argument passed to the lazy element
 * constructor
 *
 * **NOTE** this mutates the `moduleFile` param to add an import of the
 * `registerInstance` method from the Stencil core component runtime API.
 *
 * @param moduleFile information about a module containing a Stencil component
 * @returns an expression statement for a call to the `registerInstance` helper
 */
const registerInstanceStatement = (moduleFile: d.Module): ts.ExpressionStatement => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.registerInstance);

  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createIdentifier(REGISTER_INSTANCE), undefined, [
      ts.factory.createThis(),
      ts.factory.createIdentifier(HOST_REF_ARG),
    ]),
  );
};

const HOST_REF_ARG = 'hostRef';
