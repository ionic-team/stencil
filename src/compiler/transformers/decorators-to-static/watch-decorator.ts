import { flatOne } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';

export const watchDecoratorsToStatic = (
  typeChecker: ts.TypeChecker,
  decoratedProps: ts.ClassElement[],
  newMembers: ts.ClassElement[],
) => {
  const watchers = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map((method) => parseWatchDecorator(typeChecker, method));

  const flatWatchers = flatOne(watchers);

  if (flatWatchers.length > 0) {
    newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
  }
};

const parseWatchDecorator = (typeChecker: ts.TypeChecker, method: ts.MethodDeclaration): d.ComponentCompilerWatch[] => {
  const methodName = method.name.getText();
  const decorators = retrieveTsDecorators(method) ?? [];
  return decorators.filter(isDecoratorNamed('Watch')).map((decorator) => {
    const [propName] = getDeclarationParameters<string>(decorator, typeChecker);
    
    return {
      propName,
      methodName,
    };
  });
};
