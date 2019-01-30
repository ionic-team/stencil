import * as d from '@declarations';
import { createStaticGetter, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';
import { buildError } from '@utils';


export function elementDecoratorsToStatic(diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const elementRefs = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return elementDecoratorToStatic(diagnostics, typeChecker, prop);
  }).filter(element => typeof element === 'string');

  if (elementRefs.length > 0) {
    newMembers.push(createStaticGetter('elementRef', ts.createLiteral(elementRefs[0])));
    if (elementRefs.length > 1) {
      const error = buildError(diagnostics);
      error.messageText = `It's not valid to add more than one Element() decorator`;
    }
  }
}


function elementDecoratorToStatic(_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const elementDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Element'));

  if (elementDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Element');
  return prop.name.getText();
}
