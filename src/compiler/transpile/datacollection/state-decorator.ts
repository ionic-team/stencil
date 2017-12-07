import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';
import { isPropertyWithDecorators, isDecoratorNamed } from './utils';

export function getStateDecoratorMeta(node: ts.ClassDeclaration): MembersMeta {
  return node.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('State'));

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.State
        };
      }

      return membersMeta;
    }, {} as MembersMeta);
}
