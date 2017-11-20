import { ComponentOptions, ComponentMeta } from '../../../util/interfaces';
import { ENCAPSULATION } from '../../../util/constants';
import { evalText, serializeSymbol } from './utils';
import * as ts from 'typescript';

export function getComponentDecoratorMeta (checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta | undefined {
  let cmpMeta: ComponentMeta = {};
  let symbol = checker.getSymbolAtLocation(node.name);

  if (!node.decorators) {
    return;
  }

  cmpMeta.jsdoc = serializeSymbol(checker, symbol);

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

  cmpMeta.stylesMeta = {};
  Object.keys(componentOptions.styleUrls || {}).reduce((styleUrls, styleType: string) => {
    styleUrls[styleType] = {
      styleUrls: [].concat(componentOptions.styleUrls[styleType])
    };
    return styleUrls;
  }, cmpMeta.stylesMeta as { [key: string]: any });

  return cmpMeta;
}
