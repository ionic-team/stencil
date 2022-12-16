import { augmentDiagnosticWithNode, buildError, buildWarn, flatOne } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';

export const watchDecoratorsToStatic = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  decoratedProps: ts.ClassElement[],
  watchable: Set<string>,
  newMembers: ts.ClassElement[]
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
  config: d.Config,
  diagnostics: d.Diagnostic[],
  watchable: Set<string>,
  method: ts.MethodDeclaration
): d.ComponentCompilerWatch[] => {
  const methodName = method.name.getText();
  const decorators = retrieveTsDecorators(method) ?? [];
  return decorators.filter(isDecoratorNamed('Watch')).map((decorator) => {
    const [propName] = getDeclarationParameters<string>(decorator);
    if (!watchable.has(propName)) {
      const diagnostic = config.devMode ? buildWarn(diagnostics) : buildError(diagnostics);
      diagnostic.messageText = `@Watch('${propName}') is trying to watch for changes in a property that does not exist.
        Make sure only properties decorated with @State() or @Prop() are watched.`;
      augmentDiagnosticWithNode(diagnostic, decorator);
    }
    return {
      propName,
      methodName,
    };
  });
};
