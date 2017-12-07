import { ComponentOptions, ComponentMeta, ModeStyles, AssetsMeta } from '../../../util/interfaces';
import { ENCAPSULATION, DEFAULT_STYLE_MODE } from '../../../util/constants';
import { getDeclarationParameters, serializeSymbol, isDecoratorNamed } from './utils';
import * as ts from 'typescript';

export function getComponentDecoratorMeta (checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta | undefined {
  let cmpMeta: ComponentMeta = {};
  let symbol = checker.getSymbolAtLocation(node.name);

  if (!node.decorators) {
    return undefined;
  }

  cmpMeta.jsdoc = serializeSymbol(checker, symbol);

  const componentDecorator = node.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return undefined;
  }

  const [ componentOptions ] = getDeclarationParameters<ComponentOptions>(componentDecorator);

  if (!componentOptions.tag || componentOptions.tag.trim() === '') {
    throw new Error(`tag missing in component decorator: ${JSON.stringify(componentOptions, null, 2)}`);
  }

  // normalizeTag
  cmpMeta.tagNameMeta = componentOptions.tag;

  // normalizeHost
  cmpMeta.hostMeta = componentOptions.host || {};

  // normalizeEncapsulation
  cmpMeta.encapsulation =
      componentOptions.shadow ? ENCAPSULATION.ShadowDom :
      componentOptions.scoped ? ENCAPSULATION.ScopedCss :
      ENCAPSULATION.NoEncapsulation;

  // noramlizeStyles
  cmpMeta.stylesMeta = {};

  // styles: 'div { padding: 10px }'
  if (typeof componentOptions.styles === 'string' && componentOptions.styles.trim().length) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        styleStr: componentOptions.styles.trim()
      }
    };
  }

  // styleUrl: 'my-styles.scss'
  if (typeof componentOptions.styleUrl === 'string' && componentOptions.styleUrl.trim()) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        originalComponentPaths: [componentOptions.styleUrl]
      }
    };

  // styleUrls: ['my-styles.scss', 'my-other-styles']
  } else if (Array.isArray(componentOptions.styleUrls)) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        originalComponentPaths: componentOptions.styleUrls
      }
    };

  // styleUrls: {
  //   ios: 'badge.ios.scss',
  //   md: 'badge.md.scss',
  //   wp: 'badge.wp.scss'
  // }
  } else {
    Object.keys(componentOptions.styleUrls || {}).reduce((stylesMeta, styleType) => {
      let styleUrls = <ModeStyles>componentOptions.styleUrls;

      stylesMeta[styleType] = {
        originalComponentPaths: [].concat(styleUrls[styleType])
      };

      return stylesMeta;
    }, cmpMeta.stylesMeta);
  }


  cmpMeta.assetsDirsMeta = [];

  // assetsDir: './somedir'
  if (componentOptions.assetsDir) {
    const assetsMeta: AssetsMeta = {
      originalComponentPath: componentOptions.assetsDir
    };
    cmpMeta.assetsDirsMeta.push(assetsMeta);
  }

  // assetsDirs: ['./somedir', '../someotherdir']
  if (Array.isArray(componentOptions.assetsDirs)) {
    cmpMeta.assetsDirsMeta = cmpMeta.assetsDirsMeta.concat(
      componentOptions.assetsDirs.map(assetDir => ({ originalComponentPath: assetDir }))
    );
  }

  return cmpMeta;
}
