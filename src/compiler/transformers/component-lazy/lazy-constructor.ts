import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, REGISTER_INSTANCE, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { getStaticValue, updateConstructor } from '../transform-utils';
import { createLazyAttachInternalsBinding } from './attach-internals';
import { HOST_REF_ARG } from './constants';

/**
 * Update the constructor for a Stencil component's class in order to prepare
 * it for lazy-build duty (i.e. to take over a bootstrapped component)
 *
 * @param classMembers an out param of class members for the component
 * @param classNode the class declaration of interest
 * @param moduleFile information about the component's home module
 * @param cmp compiler metadata about the component
 */
export const updateLazyComponentConstructor = (
  classMembers: ts.ClassElement[],
  classNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
) => {
  const cstrMethodArgs = [
    ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier(HOST_REF_ARG)),
  ];

  const cstrStatements = [
    registerInstanceStatement(moduleFile),
    ...addConstructorInitialProxyValues(classNode),
    ...addCreateEvents(moduleFile, cmp),
    ...createLazyAttachInternalsBinding(cmp),
  ];

  updateConstructor(classNode, classMembers, cstrStatements, cstrMethodArgs);
};

/**
 * With a ts config of `target: '2022', useDefineForClassFields: true`
 * compiled Stencil components went from:
 *
 * ```ts
 * class MyComponent {
 *   constructor(hostRef) {
 *     registerInstance(this, hostRef);
 *     this.prop1 = 'value1';
 *     this.prop2 = 'value2';
 *   }
 * }
 * ```
 * To:
 * ```ts
 * class MyComponent {
 *  constructor(hostRef) {
 *    registerInstance(this, hostRef);
 *  }
 *  prop1 = 'value2';
 *  prop2 = 'value1';
 *  // ^^ These initial values are a problem for lazy components.
 *  // The incoming, initial values from the proxied element is ignored.
 * }
 * ```
 *
 * To combat this, if we find 'modern', initial static prop values,
 * We change the constructor to:
 *
 * ```ts
 * class MyComponent {
 *  constructor(hostRef) {
 *    registerInstance(this, hostRef);
 *    this.prop1 = hostRef.$instanceValues$.has('prop1') ? hostRef.$instanceValues$.get('prop1') : 'value1';
 *    this.prop2 = hostRef.$instanceValues$.has('prop2') ? hostRef.$instanceValues$.get('prop2') : 'value2';
 *  }
 *  prop1 = 'value2';
 *  prop2 = 'value1';
 * }
 * ```
 *
 * @param classNode the parental class node
 * @returns potentially new statements to add to the constructor
 */
const addConstructorInitialProxyValues = (classNode: ts.ClassDeclaration) => {
  const parsedProps: { [key: string]: d.ComponentCompilerProperty } = getStaticValue(classNode.members, 'properties');
  if (!parsedProps) return [];

  const propNames = Object.keys(parsedProps);
  const newStatements: ts.Statement[] = [];

  for (const propName of propNames) {
    // comb through the class' body members to find a corresponding, 'modern' prop initializer
    const dynamicPropName = parsedProps[propName].ogPropName || '';

    // looking for `[example]` or `example` class property declarations
    const prop = classNode.members.find((m) => {
      return (
        ts.isPropertyDeclaration(m) &&
        ((ts.isComputedPropertyName(m.name) && m.name.expression.getText() === dynamicPropName) ||
          m.name.getText() === propName)
      );
    }) as any as ts.PropertyDeclaration;

    if (!prop) continue;

    // we found what we were looking for, create a new statement to add to the constructor
    const defaultValue = prop.initializer || ts.factory.createIdentifier('undefined');

    let accessExpression: ts.ElementAccessExpression | ts.PropertyAccessExpression;
    if (ts.isComputedPropertyName(prop.name) && dynamicPropName) {
      accessExpression = ts.factory.createElementAccessExpression(
        ts.factory.createThis(),
        ts.factory.createIdentifier(dynamicPropName),
      );
    } else {
      accessExpression = ts.factory.createPropertyAccessExpression(ts.factory.createThis(), propName);
    }

    newStatements.push(
      ts.factory.createExpressionStatement(
        ts.factory.createBinaryExpression(
          accessExpression,
          ts.SyntaxKind.EqualsToken,
          ts.factory.createConditionalExpression(
            createCallExpression(propName, 'has'),
            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
            createCallExpression(propName, 'get'),
            ts.factory.createToken(ts.SyntaxKind.ColonToken),
            defaultValue,
          ),
        ),
      ),
    );
  }
  return newStatements;
};

/**
 * Creates a call expression as either::
 * `hostRef.$instanceValues$.has('prop1')` or `hostRef.$instanceValues$.get('prop1')`
 *
 * @param prop the property name to check for
 * @param methodName the method to call on the instance values object
 * @returns a new call expression
 */
const createCallExpression = (prop: string, methodName: 'has' | 'get') =>
  ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier(HOST_REF_ARG),
        ts.factory.createIdentifier('$instanceValues$'),
      ),
      ts.factory.createIdentifier(methodName),
    ),
    undefined,
    [ts.factory.createStringLiteral(prop)],
  );

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
