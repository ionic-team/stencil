import { ComponentOptions, ComponentMeta } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import * as ts from 'typescript';
import { serializeSymbol } from './utils';

export function getMethodDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta {
  return node.members
  .filter(member => {
    return (ts.isMethodDeclaration(member) && Array.isArray(member.decorators));
  })
  .reduce((membersMeta, member) => {
    const elementDecorator = member.decorators.find(dec => {
      return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'Method');
    });
    const symbol = checker.getSymbolAtLocation(member.name);

    if (elementDecorator) {
      membersMeta[member.name.getText()] = {
        memberType: MEMBER_TYPE.Method,
        jsdoc: serializeSymbol(checker, symbol)
      };
    }

    return membersMeta;
  }, {} as ComponentMeta);
}
