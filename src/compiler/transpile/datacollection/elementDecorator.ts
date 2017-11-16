import { ComponentOptions, MembersMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import ts from 'typescript';

export function getElementDecoratorMeta (node: ts.ClassDeclaration): MembersMeta {
  return node.members
    .filter(member => {
      return (ts.isPropertyDeclaration(member) && Array.isArray(member.decorators));
    })
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(dec => {
        return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'Element');
      });

      if (elementDecorator) {
        membersMeta[member.name.getText()] = {
          memberType: MEMBER_TYPE.Element
        };
      }

      return membersMeta;
    }, {} as MembersMeta);
}
