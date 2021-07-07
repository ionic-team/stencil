import type * as d from '../../../declarations';
import { buildError } from '@utils';
import { createStaticGetter } from '../transform-utils';
import { isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';

export const elementDecoratorsToStatic = (
  diagnostics: d.Diagnostic[],
  decoratedMembers: ts.ClassElement[],
  typeChecker: ts.TypeChecker,
  newMembers: ts.ClassElement[],
) => {
  const elementRefs = decoratedMembers
    .filter(ts.isPropertyDeclaration)
    .map(prop => parseElementDecorator(diagnostics, typeChecker, prop))
    .filter(element => !!element);

  if (elementRefs.length > 0) {
    newMembers.push(createStaticGetter('elementRef', ts.createLiteral(elementRefs[0])));
    if (elementRefs.length > 1) {
      const error = buildError(diagnostics);
      error.messageText = `It's not valid to add more than one Element() decorator`;
    }
  }
};

const parseElementDecorator = (
  _diagnostics: d.Diagnostic[],
  _typeChecker: ts.TypeChecker,
  prop: ts.PropertyDeclaration,
) => {
  const elementDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Element'));

  if (elementDecorator == null) {
    return null;
  }
  return prop.name.getText();
};
