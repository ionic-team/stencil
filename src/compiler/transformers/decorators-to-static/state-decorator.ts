import ts from 'typescript';

import { createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';

/**
 * Convert class fields decorated with `@State` to static getters
 *
 * This function takes a list of decorated properties pulled off of a class
 * declaration AST Node and builds up equivalent static getter AST nodes
 * with which they can be replaced.
 *
 * @param decoratedProps TypeScript AST nodes representing class members
 * @param watchable set of names of fields which should be watched for changes
 * @param newMembers an out param containing new class members
 */
export const stateDecoratorsToStatic = (
  decoratedProps: ts.ClassElement[],
  watchable: Set<string>,
  newMembers: ts.ClassElement[],
) => {
  const states = decoratedProps
    .filter(ts.isPropertyDeclaration)
    .map((prop) => stateDecoratorToStatic(prop, watchable))
    .filter((state): state is ts.PropertyAssignment => !!state);

  if (states.length > 0) {
    newMembers.push(createStaticGetter('states', ts.factory.createObjectLiteralExpression(states, true)));
  }
};

/**
 * Convert a property declaration decorated with `@State` to a property
 * assignment AST node which maps the name of the state property to an empty
 * object.
 *
 * Note that this function will return null if the property declaration is
 * decorated with other decorators.
 *
 * @param prop A TypeScript AST node representing a class property declaration
 * @param watchable set of names of fields which should be watched for changes
 * @returns a property assignment AST Node which maps the name of the state
 * prop to an empty object
 */
const stateDecoratorToStatic = (prop: ts.PropertyDeclaration, watchable: Set<string>): ts.PropertyAssignment | null => {
  const stateDecorator = retrieveTsDecorators(prop)?.find(isDecoratorNamed('State'));
  if (stateDecorator == null) {
    return null;
  }

  const stateName = prop.name.getText();
  watchable.add(stateName);
  return ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(stateName),
    ts.factory.createObjectLiteralExpression([], true),
  );
};
