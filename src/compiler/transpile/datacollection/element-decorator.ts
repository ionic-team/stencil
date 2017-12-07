import { MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';
import { isDecoratorNamed, isPropertyWithDecorators } from './utils';

export function getElementDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): MembersMeta {
  checker;
  return classNode.members
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
