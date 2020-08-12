import { createStaticGetter } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';

export const stateDecoratorsToStatic = (decoratedProps: ts.ClassElement[], watchable: Set<string>, newMembers: ts.ClassElement[]) => {
  const states = decoratedProps
    .filter(ts.isPropertyDeclaration)
    .map(prop => stateDecoratorToStatic(prop, watchable))
    .filter(state => !!state);

  if (states.length > 0) {
    newMembers.push(createStaticGetter('states', ts.createObjectLiteral(states, true)));
  }
};

const stateDecoratorToStatic = (prop: ts.PropertyDeclaration, watchable: Set<string>) => {
  const stateDecorator = prop.decorators.find(isDecoratorNamed('State'));
  if (stateDecorator == null) {
    return null;
  }

  const stateName = prop.name.getText();
  watchable.add(stateName);
  return ts.createPropertyAssignment(ts.createLiteral(stateName), ts.createObjectLiteral([], true));
};
