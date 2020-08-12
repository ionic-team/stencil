import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import { flatOne, buildError, augmentDiagnosticWithNode, buildWarn } from '@utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';

export const watchDecoratorsToStatic = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  decoratedProps: ts.ClassElement[],
  watchable: Set<string>,
  newMembers: ts.ClassElement[],
) => {
  const watchers = decoratedProps.filter(ts.isMethodDeclaration).map(method => parseWatchDecorator(config, diagnostics, watchable, method));

  const flatWatchers = flatOne(watchers);

  if (flatWatchers.length > 0) {
    newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
  }
};

const parseWatchDecorator = (config: d.Config, diagnostics: d.Diagnostic[], watchable: Set<string>, method: ts.MethodDeclaration): d.ComponentCompilerWatch[] => {
  const methodName = method.name.getText();
  return method.decorators.filter(isDecoratorNamed('Watch')).map(decorator => {
    const [propName] = getDeclarationParameters<string>(decorator);
    if (!watchable.has(propName)) {
      const dianostic = config.devMode ? buildWarn(diagnostics) : buildError(diagnostics);
      dianostic.messageText = `@Watch('${propName}') is trying to watch for changes in a property that does not exist.
        Make sure only properties decorated with @State() or @Prop() are watched.`;
      augmentDiagnosticWithNode(dianostic, decorator);
    }
    return {
      propName,
      methodName,
    };
  });
};
