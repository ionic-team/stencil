import * as d from '@declarations';
import { MEMBER_TYPE } from '@utils';
import { isDecoratorNamed, isPropertyWithDecorators } from './utils';
import ts from 'typescript';


export function getElementDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration) {
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
    }, {} as d.MembersMeta);
}
