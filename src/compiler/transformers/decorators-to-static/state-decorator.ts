import * as d from '../../../declarations';
import { createStaticGetter } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';


export const stateDecoratorsToStatic = (diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) => {
  const states = decoratedProps
    .filter(ts.isPropertyDeclaration)
    .map(prop => stateDecoratorToStatic(diagnostics, typeChecker, prop))
    .filter(state => !!state);

  if (states.length > 0) {
    newMembers.push(createStaticGetter('states', ts.createObjectLiteral(states, true)));
  }
};


const stateDecoratorToStatic = (_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) => {
  const stateDecorator = prop.decorators.find(isDecoratorNamed('State'));
  if (stateDecorator == null) {
    return null;
  }

  const stateName = prop.name.getText();
  return ts.createPropertyAssignment(ts.createLiteral(stateName), ts.createObjectLiteral([], true));
};
