import { ComponentOptions, ComponentMeta, PropChangeMeta } from '../../../util/interfaces';
import { PROP_CHANGE } from '../../../util/constants';
import { getDeclarationParameters, serializeSymbol } from './utils';
import * as ts from 'typescript';

export function getPropChangeDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta {
  return node.members
    .filter(member => {
      return (ts.isMethodDeclaration(member) && Array.isArray(member.decorators));
    })
    .reduce((membersMeta, member) => {
      const propChangeDecorator = member.decorators.find(dec => {
        return (ts.isCallExpression(dec.expression) &&
          ['PropWillChange', 'PropDidChange'].indexOf(dec.expression.expression.getText()) !== -1);
      });

      const [ watchedName ] = getDeclarationParameters(propChangeDecorator);

      if (ts.isCallExpression(propChangeDecorator.expression) && propChangeDecorator && watchedName) {
        const decoratorName = propChangeDecorator.expression.expression.getText();
        let metaObj: PropChangeMeta[];

        if (decoratorName === 'PropWillChange') {
          metaObj = membersMeta.propsWillChangeMeta = membersMeta.propsWillChangeMeta || [];
        } else if (decoratorName === 'PropDidChange') {
          metaObj = membersMeta.propsDidChangeMeta = membersMeta.propsDidChangeMeta || [];
        }

        metaObj.push({
          [PROP_CHANGE.PropName]: watchedName,
          [PROP_CHANGE.MethodName]: member.name.getText(),
        });
      }

      return membersMeta;
    }, {} as ComponentMeta);
}
