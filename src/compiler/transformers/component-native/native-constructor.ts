import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';

export const updateNativeConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
  ensureSuper: boolean
) => {
  if (cmp.isPlain) {
    return;
  }
  const cstrMethodIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    let statements: ts.Statement[] = [
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...cstrMethod.body.statements,
      ...addLegacyProps(moduleFile, cmp),
    ];

    if (ensureSuper) {
      const hasSuper = cstrMethod.body.statements.some((s) => s.kind === ts.SyntaxKind.SuperKeyword);
      if (!hasSuper) {
        statements = [createNativeConstructorSuper(), ...statements];
      }
    }

    classMembers[cstrMethodIndex] = ts.factory.updateConstructorDeclaration(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethod.parameters,
      ts.factory.updateBlock(cstrMethod.body, statements)
    );
  } else {
    // create a constructor()
    let statements: ts.Statement[] = [
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...addLegacyProps(moduleFile, cmp),
    ];

    if (ensureSuper) {
      statements = [createNativeConstructorSuper(), ...statements];
    }

    const cstrMethod = ts.factory.createConstructorDeclaration(
      undefined,
      undefined,
      undefined,
      ts.factory.createBlock(statements, true)
    );
    classMembers.unshift(cstrMethod);
  }
};

/**
 * Generates a series of expression statements used to help initialize a Stencil component
 * @param moduleFile the Stencil module that will be instantiated
 * @param cmp the component's metadata
 * @returns the generated expression statements
 */
const nativeInit = (moduleFile: d.Module, cmp: d.ComponentCompilerMeta): ReadonlyArray<ts.ExpressionStatement> => {
  const initStatements = [nativeRegisterHostStatement()];
  if (cmp.encapsulation === 'shadow') {
    initStatements.push(nativeAttachShadowStatement(moduleFile));
  }
  return initStatements;
};

const nativeRegisterHostStatement = () => {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('__registerHost')),
      undefined,
      undefined
    )
  );
};

/**
 * Generates an expression statement for attaching a shadow DOM tree to an element.
 * @param moduleFile the Stencil module that will use the generated expression statement
 * @returns the generated expression statement
 */
const nativeAttachShadowStatement = (moduleFile: d.Module): ts.ExpressionStatement => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.attachShadow);
  // Create an expression statement, `this.__attachShadow();`
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('__attachShadow')),
      undefined,
      undefined
    )
  );
};

const createNativeConstructorSuper = () => {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createIdentifier('super'), undefined, undefined)
  );
};
