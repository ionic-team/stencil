import { readOnlyArrayHasStringMember } from '@utils';
import ts from 'typescript';

import { CONSTRUCTOR_DEFINED_MEMBER_DECORATORS } from './decorators-constants';

/**
 * Helper function to detect if a class element fits the following criteria:
 * - It is a property declaration (e.g. `foo`)
 * - It has an initializer (e.g. `foo *=1*`)
 * - The property declaration has the `static` modifier on it (e.g. `*static* foo =1`)
 * - The property declaration does not include a Stencil @Prop or @State decorator
 * @param classElm the class member to test
 * @returns true if the class member fits the above criteria, false otherwise
 */
export const hasStaticInitializerInClass = (classElm: ts.ClassElement): boolean => {
  return (
    ts.isPropertyDeclaration(classElm) &&
    classElm.initializer !== undefined &&
    Array.isArray(classElm.modifiers) &&
    classElm.modifiers!.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
    !classElm.modifiers!.some(isStencilStateOrPropDecorator)
  );
};

/**
 * Determines if a Modifier-like node is a Stencil `@Prop()` or `@State()` decorator
 * @param modifier the AST node to evaluate
 * @returns true if the node is a decorator with the name 'Prop' or 'State', false otherwise
 */
const isStencilStateOrPropDecorator = (modifier: ts.ModifierLike): boolean => {
  if (ts.isDecorator(modifier)) {
    const decoratorName =
      ts.isCallExpression(modifier.expression) &&
      ts.isIdentifier(modifier.expression.expression) &&
      modifier.expression.expression.text;
    return (
      typeof decoratorName !== 'boolean' &&
      readOnlyArrayHasStringMember(CONSTRUCTOR_DEFINED_MEMBER_DECORATORS, decoratorName)
    );
  }
  return false;
};
