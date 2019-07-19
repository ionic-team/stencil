import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
import { flatOne } from '@utils';
import { getDeclarationParameters, isDecoratorNamed } from './decorator-utils';
import ts from 'typescript';


export const watchDecoratorsToStatic = (diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], newMembers: ts.ClassElement[]) => {
  const watchers = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map(method => parseWatchDecorator(diagnostics, method));

  const flatWatchers = flatOne(watchers);
  if (flatWatchers.length > 0) {
    newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
  }
};

const isWatchDecorator = isDecoratorNamed('Watch');
const isPropWillChangeDecorator = isDecoratorNamed('PropWillChange');
const isPropDidChangeDecorator = isDecoratorNamed('PropDidChange');

const parseWatchDecorator = (_diagnostics: d.Diagnostic[], method: ts.MethodDeclaration): d.ComponentCompilerWatch[] => {
  const methodName = method.name.getText();
  return method.decorators
    .filter(decorator => (
      isWatchDecorator(decorator) ||
      isPropWillChangeDecorator(decorator) ||
      isPropDidChangeDecorator(decorator)
    ))
    .map(decorator => {
      const [ propName ] = getDeclarationParameters<string>(decorator);
      return {
        propName,
        methodName
      };
    });
};

// TODO
// const isPropWatchable = (cmpMeta: d.ComponentMeta, propName: string) => {
//   const membersMeta = cmpMeta.membersMeta;
//   if (!membersMeta) {
//     return false;
//   }
//   const member = membersMeta[propName];
//   if (!member) {
//     return false;
//   }
// const type = member.memberType;
// return type === MEMBER_FLAGS.State || type === MEMBER_FLAGS.Prop || type === MEMBER_FLAGS.PropMutable;
// };
