import { DIST_CUSTOM_ELEMENTS } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { addOutputTargetCoreRuntimeApi, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';
import { retrieveTsModifiers } from '../transform-utils';

/**
 * Updates a constructor to include:
 * - a `super()` call
 * - function calls to initialize the component
 * - function calls to create custom event emitters
 * If a constructor does not exist, one will be created
 *
 * The constructor will be added to the provided list of {@link ts.ClassElement}s in place
 *
 * @param classMembers the class elements to modify
 * @param moduleFile the Stencil module representation of the component class
 * @param cmp the component metadata generated for the component
 */
export const updateNativeConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
): void => {
  if (cmp.isPlain) {
    return;
  }
  const cstrMethodIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;
    // a constructor may not have a body (e.g. in the case of constructor overloads)
    const cstrBodyStatements: ts.NodeArray<ts.Statement> = cstrMethod.body?.statements ?? ts.factory.createNodeArray();

    let statements: ts.Statement[] = [
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...cstrBodyStatements,
      ...addLegacyProps(moduleFile, cmp),
    ];

    const hasSuper = cstrBodyStatements.some((s) => s.kind === ts.SyntaxKind.SuperKeyword);
    if (!hasSuper) {
      statements = [createNativeConstructorSuper(), ...statements];
    }

    classMembers[cstrMethodIndex] = ts.factory.updateConstructorDeclaration(
      cstrMethod,
      retrieveTsModifiers(cstrMethod),
      cstrMethod.parameters,
      ts.factory.updateBlock(cstrMethod.body, statements)
    );
  } else {
    // create a constructor()
    const statements: ts.Statement[] = [
      createNativeConstructorSuper(),
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...addLegacyProps(moduleFile, cmp),
    ];

    const cstrMethod = ts.factory.createConstructorDeclaration(undefined, [], ts.factory.createBlock(statements, true));
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

/**
 * Generate an expression statement to register a host element with its VDOM equivalent in a global element-to-vdom
 * mapping.
 * @returns the generated expression statement
 */
const nativeRegisterHostStatement = (): ts.ExpressionStatement => {
  // Create an expression statement, `this.__registerHost();`
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
  addOutputTargetCoreRuntimeApi(moduleFile, DIST_CUSTOM_ELEMENTS, RUNTIME_APIS.attachShadow);
  // Create an expression statement, `this.__attachShadow();`
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier('__attachShadow')),
      undefined,
      undefined
    )
  );
};

/**
 * Create an expression statement for calling `super()` for a class.
 * @returns the generated expression statement
 */
const createNativeConstructorSuper = (): ts.ExpressionStatement => {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createSuper(), undefined, undefined)
  );
};
