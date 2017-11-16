import { ComponentOptions, ComponentMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import ts from 'typescript';

export function getMethodDecoratorMeta (node: ts.ClassDeclaration): ComponentMeta {
  return node.members
  .filter(member => {
    return (ts.isMethodDeclaration(member) && Array.isArray(member.decorators));
  })
  .reduce((membersMeta, member) => {
    const elementDecorator = member.decorators.find(dec => {
      return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'Method');
    });

    if (elementDecorator) {
      membersMeta[member.name.getText()] = {
        memberType: MEMBER_TYPE.Method
      };
    }

    return membersMeta;
  }, {} as ComponentMeta);
}
