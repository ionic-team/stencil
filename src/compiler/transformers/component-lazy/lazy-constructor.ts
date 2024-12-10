import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, REGISTER_INSTANCE, RUNTIME_APIS } from '../core-runtime-apis';
import { addCreateEvents } from '../create-event';
import { type ConvertIdentifier, updateConstructor } from '../transform-utils';
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
  addConstructorInitialProxyValues(classMembers, classNode);

  const cstrStatements = [
    registerInstanceStatement(moduleFile),
    ...addCreateEvents(moduleFile, cmp),
    ...createLazyAttachInternalsBinding(cmp),
  ];

  updateConstructor(classNode, classMembers, cstrStatements, cstrMethodArgs);
};

/**
 * With a ts config of `target: '2022', useDefineForClassFields: true`
 * compiled stencil classes now look like:
 * ```ts
 * class MyComponent {
 *  constructor(hostRef) {
 *    registerInstance(this, hostRef);
 *    this.prop1 = 'value1';
 *    this.prop2 = 'value2';
 *  }
 *  prop1 = 'value2';
 *  prop2 = 'value1';
 *  // ^^ These initial values are a problem for lazy components.
 *  // The incoming, initial values from the proxied element is ignored.
 * }
 * ```
 *
 * To combat this, if we find initial static prop values,
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
 * @param classMembers children content of the class
 * @param classNode the parental class node
 * @returns potentially updated children content of the class
 */
const addConstructorInitialProxyValues = (classMembers: ts.ClassElement[], classNode: ts.ClassDeclaration) => {
  const constructorIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);
  const constructorMethod = classMembers[constructorIndex];
  let didUpdate = false;

  if (constructorIndex >= 0 && ts.isConstructorDeclaration(constructorMethod)) {
    const updatedStatements: ts.NodeArray<ts.Statement> = ts.factory.createNodeArray(
      constructorMethod.body?.statements.map((st) => {
        if (ts.isExpressionStatement(st)) {
          const expression = st.expression;

          if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            const left = expression.left;

            if (ts.isPropertyAccessExpression(left)) {
              // we found a statement that might need updating e.g. `this.prop1 = 'value1'`

              const propName = getText(left.name);
              const defaultValue = expression.right;

              // comb through the class' body members to find a corresponding, 'modern' prop initializer
              const prop = classNode.members.find((m) => ts.isPropertyDeclaration(m) && getText(m.name) === propName);

              if (prop) {
                // we found what we were looking for, update the statement
                didUpdate = true;
                return ts.factory.createExpressionStatement(
                  ts.factory.createBinaryExpression(
                    ts.factory.createPropertyAccessExpression(ts.factory.createThis(), left.name),
                    ts.SyntaxKind.EqualsToken,
                    ts.factory.createConditionalExpression(
                      createCallExpression(propName, 'has'),
                      ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                      createCallExpression(propName, 'get'),
                      ts.factory.createToken(ts.SyntaxKind.ColonToken),
                      defaultValue,
                    ),
                  ),
                );
              }
            }
          }
        }
        // didn't find what we were looking for, return the original statement
        return st;
      }),
    );

    if (didUpdate) {
      classMembers[constructorIndex] = ts.factory.updateConstructorDeclaration(
        constructorMethod,
        undefined,
        [],
        ts.factory.updateBlock(constructorMethod?.body, updatedStatements),
      );
    }
  }
  return classMembers;
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
 * `sourceFile` doesn't get set in our tests' during an after-transformer visit,
 * (which is required for ts' `getText()` to work) so we'll use an internal property
 * @param node any ts node
 * @returns the node's text content
 */
const getText = (node: ts.Node) => {
  return node.getSourceFile() ? node.getText() : (node as any as ConvertIdentifier).__escapedText;
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
