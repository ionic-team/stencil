import { ComponentOptions, MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';

export function getStateDecoratorMeta(node: ts.ClassDeclaration): MembersMeta {
  return node.members
    .filter(member => {
      return (ts.isPropertyDeclaration(member) && Array.isArray(member.decorators));
    })
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(dec => {
        return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'State');
      });

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.State
        };
      }

      return membersMeta;
    }, {} as MembersMeta);
}
