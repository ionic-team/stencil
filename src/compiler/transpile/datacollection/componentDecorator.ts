import { ComponentOptions, ComponentMeta } from '../../../util/interfaces';
import { ENCAPSULATION } from '../../../util/constants';
import { evalText } from './utils';
import * as ts from 'typescript';

export function getComponentDecoratorMeta (node: ts.ClassDeclaration): ComponentMeta | undefined {
  let cmpMeta: ComponentMeta = {};
  if (!node.decorators) {
    return;
  }

  const componentDecorator = node.decorators.find(dec => {
    if (!ts.isCallExpression(dec.expression)) {
      return false;
    }
    return dec.expression.expression.getText() === 'Component';
  });

  if (!componentDecorator) {
    return;
  }

  const [ componentOptionsLiteral ] = (<ts.CallExpression>componentDecorator.expression).arguments;

  const componentOptions = evalText(componentOptionsLiteral.getText());

  if (!componentOptions.tag || componentOptions.tag.trim() === '') {
    throw new Error(`tag missing in component decorator: ${JSON.stringify(componentOptions, null, 2)}`);
  }

  cmpMeta.tagNameMeta = componentOptions.tag;
  cmpMeta.hostMeta = componentOptions.host;
  cmpMeta.encapsulation =
      componentOptions.shadow ? ENCAPSULATION.ShadowDom :
      componentOptions.scoped ? ENCAPSULATION.ScopedCss :
      ENCAPSULATION.NoEncapsulation;

  return cmpMeta;
}
