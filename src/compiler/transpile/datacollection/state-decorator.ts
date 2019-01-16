import * as d from '../../../declarations';
import { isDecoratorNamed, isPropertyWithDecorators } from './utils';
import { MEMBER_TYPE } from '@stencil/core/utils';
import ts from 'typescript';


export function getStateDecoratorMeta(classNode: ts.ClassDeclaration) {
  return classNode.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('State'));

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.State
        };
      }

      return membersMeta;
    }, {} as d.MembersMeta);
}
