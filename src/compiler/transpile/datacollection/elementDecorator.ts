import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';
import { isPropertyWithDecorators, isDecoratorNamed } from './utils';

export function getElementDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): MembersMeta {
  checker;

  return node.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Element'));

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.Element
        };
      }

      return membersMeta;
    }, {} as MembersMeta);
}
