import * as d from '../../../declarations';
import { createStaticGetter, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function elementDecoratorsToStatic(diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const elementRef: string = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return elementDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(element => typeof element === 'string')[0];

  if (elementRef) {
    newMembers.push(createStaticGetter('elementRef', ts.createLiteral(elementRef)));
  }
}


function elementDecoratorToStatic(_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const elementDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Element'));

  if (elementDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Element');

  const elementRef = (prop.name as ts.Identifier).text;

  return elementRef;
}
