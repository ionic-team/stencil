import * as d from '../../../declarations';
import { isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(config: d.Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration) {
  return classNode.members
    .filter(isMethodWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Method'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      if (elementDecorator) {
        const symbol = checker.getSymbolAtLocation(member.name);
        const methodName = member.name.getText();

        validatePublicMethodName(config, methodName);

        membersMeta[methodName] = {
          memberType: MEMBER_TYPE.Method,
          jsdoc: serializeSymbol(checker, symbol)
        };
      }

      return membersMeta;
    }, {} as d.MembersMeta);
}


function validatePublicMethodName(config: d.Config, methodName: string) {
  if (methodName[0] === 'o' && methodName[1] === 'n' && /[A-Z]/.test(methodName[2])) {
    config.logger.warn([
      `In order to be compatible with all event listeners on elements, it's `,
      `recommended the public method name "${methodName}" does not start with "on". `,
      `Please rename the method so it does not conflict with common event listener naming.`
    ].join(''));
  }
}
