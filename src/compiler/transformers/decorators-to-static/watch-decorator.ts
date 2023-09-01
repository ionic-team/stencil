import { flatOne } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';

export const watchDecoratorsToStatic = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  decoratedProps: ts.ClassElement[],
  watchable: Set<string>,
  newMembers: ts.ClassElement[],
) => {
  const watchers = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map((method) => parseWatchDecorator(config, diagnostics, watchable, method));

  const flatWatchers = flatOne(watchers);

  if (flatWatchers.length > 0) {
    newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
  }
};

const parseWatchDecorator = (
  _config: d.Config,
  _diagnostics: d.Diagnostic[],
  _watchable: Set<string>,
  method: ts.MethodDeclaration,
): d.ComponentCompilerWatch[] => {
  const methodName = method.name.getText();
  const decorators = retrieveTsDecorators(method) ?? [];
  return decorators.filter(isDecoratorNamed('Watch')).map((decorator) => {
    const [propName] = getDeclarationParameters<string>(decorator);

    return {
      propName,
      methodName,
    };
  });
};
