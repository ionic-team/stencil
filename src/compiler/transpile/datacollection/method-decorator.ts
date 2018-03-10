import { isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import { MembersMeta } from '../../../declarations';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getMethodDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): MembersMeta {
  return classNode.members
    .filter(isMethodWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Method'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const symbol = checker.getSymbolAtLocation(member.name);

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.Method,
          jsdoc: serializeSymbol(checker, symbol)
        };
      }

      return membersMeta;
    }, {} as MembersMeta);
}
