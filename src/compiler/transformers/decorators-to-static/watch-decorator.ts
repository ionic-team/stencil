import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, isDecoratorNamed } from '../transform-utils';
import ts from 'typescript';
import { flatOne } from '@utils';


export function watchDecoratorsToStatic(diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], newMembers: ts.ClassElement[]) {
  const watchers = decoratedProps
    .filter(ts.isMethodDeclaration)
    .map(method => parseWatchDecorator(diagnostics, method));

  const flatWatchers = flatOne(watchers);
  if (flatWatchers.length > 0) {
    newMembers.push(createStaticGetter('watchers', convertValueToLiteral(flatWatchers)));
  }
}

const isWatchDecorator = isDecoratorNamed('Watch');
const isPropWillChangeDecorator = isDecoratorNamed('PropWillChange');
const isPropDidChangeDecorator = isDecoratorNamed('PropDidChange');

function parseWatchDecorator(_diagnostics: d.Diagnostic[], method: ts.MethodDeclaration): d.ComponentCompilerWatch[] {
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
}

// TODO
// function isPropWatchable(cmpMeta: d.ComponentMeta, propName: string) {
//   const membersMeta = cmpMeta.membersMeta;
//   if (!membersMeta) {
//     return false;
//   }
//   const member = membersMeta[propName];
//   if (!member) {
//     return false;
//   }
// const type = member.memberType;
// return type === MEMBER_TYPE.State || type === MEMBER_TYPE.Prop || type === MEMBER_TYPE.PropMutable;
// }
