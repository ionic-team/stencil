import * as d from '../../../declarations';
import { createStaticGetter, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function stateDecoratorsToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration, typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const decoratedProps = cmpNode.members.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);

  if (decoratedProps.length === 0) {
    return;
  }

  const states: ts.ObjectLiteralElementLike[] = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return stateDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(state => !!state);

  if (states.length > 0) {
    newMembers.push(createStaticGetter('states', ts.createObjectLiteral(states, true)));
  }
}


function stateDecoratorToStatic(_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const stateDecorator = prop.decorators.find(isDecoratorNamed('State'));

  if (stateDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'State');

  const stateName = (prop.name as ts.Identifier).text;

  const propertyAssignment = ts.createPropertyAssignment(ts.createLiteral(stateName), ts.createObjectLiteral([], true));

  return propertyAssignment;
}
