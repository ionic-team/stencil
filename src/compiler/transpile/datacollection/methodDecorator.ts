import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';
import { serializeSymbol, isMethodWithDecorators, isDecoratorNamed } from './utils';

export function getMethodDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): MembersMeta {
  return node.members
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
