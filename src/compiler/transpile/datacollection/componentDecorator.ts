import { ComponentOptions, ComponentMeta, ModeStyles } from '../../../util/interfaces';
import { ENCAPSULATION, DEFAULT_STYLE_MODE } from '../../../util/constants';
import { getDeclarationParameters, serializeSymbol } from './utils';
import * as ts from 'typescript';

export function getComponentDecoratorMeta (checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta | undefined {
  let cmpMeta: ComponentMeta = {};
  let symbol = checker.getSymbolAtLocation(node.name);

  if (!node.decorators) {
    return undefined;
  }

  cmpMeta.jsdoc = serializeSymbol(checker, symbol);

  const componentDecorator = node.decorators.find(dec => {
    if (!ts.isCallExpression(dec.expression)) {
      return false;
    }
    return dec.expression.expression.getText() === 'Component';
  });

  if (!componentDecorator) {
    return undefined;
  }

  const [ componentOptions ] = getDeclarationParameters<ComponentOptions>(componentDecorator);

  if (!componentOptions.tag || componentOptions.tag.trim() === '') {
    throw new Error(`tag missing in component decorator: ${JSON.stringify(componentOptions, null, 2)}`);
  }

  cmpMeta.tagNameMeta = componentOptions.tag;
  cmpMeta.hostMeta = componentOptions.host || {};
  cmpMeta.encapsulation =
      componentOptions.shadow ? ENCAPSULATION.ShadowDom :
      componentOptions.scoped ? ENCAPSULATION.ScopedCss :
      ENCAPSULATION.NoEncapsulation;

  cmpMeta.stylesMeta = {};

  // If Component Options styleUrls is an array then add to default style mode
  if (Array.isArray(componentOptions.styleUrls)) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        cmpRelativePaths: componentOptions.styleUrls
      }
    };
  } else {
    Object.keys(componentOptions.styleUrls || {}).reduce((stylesMeta, styleType) => {
      let styleUrls = <ModeStyles>componentOptions.styleUrls;

      stylesMeta[styleType] = {
        cmpRelativePaths: [].concat(styleUrls[styleType])
      };

      return stylesMeta;
    }, cmpMeta.stylesMeta);
  }

  return cmpMeta;
}
