import { AssetsMeta, ComponentMeta, ComponentOptions, ExternalStyleMeta, ModeStyles } from '../../../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { getDeclarationParameters, isDecoratorNamed, serializeSymbol } from './utils';
import * as ts from 'typescript';


export function getComponentDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): ComponentMeta | undefined {
  const cmpMeta: ComponentMeta = {};
  const symbol = checker.getSymbolAtLocation(node.name);

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
  if (typeof componentOptions.styles === 'string') {
    componentOptions.styles = componentOptions.styles.trim();
    if (componentOptions.styles.length > 0) {
      cmpMeta.stylesMeta = {
        [DEFAULT_STYLE_MODE]: {
          styleStr: componentOptions.styles
        }
      };
    }
  }

  // styleUrl: 'my-styles.css'
  if (typeof componentOptions.styleUrl === 'string' && componentOptions.styleUrl.trim()) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        externalStyles: [{
          originalComponentPath: componentOptions.styleUrl.trim()
        }]
      }
    };

  // styleUrls: ['my-styles.css', 'my-other-styles']
  } else if (Array.isArray(componentOptions.styleUrls)) {
    cmpMeta.stylesMeta = {
      [DEFAULT_STYLE_MODE]: {
        externalStyles: componentOptions.styleUrls.map(styleUrl => {
          const externalStyle: ExternalStyleMeta = {
            originalComponentPath: styleUrl.trim()
          };
          return externalStyle;
        })
      }
    };

  // styleUrls: {
  //   ios: 'badge.ios.css',
  //   md: 'badge.md.css',
  //   wp: 'badge.wp.css'
  // }
  } else {

    Object.keys(componentOptions.styleUrls || {}).reduce((stylesMeta, styleType) => {
      const styleUrls = <ModeStyles>componentOptions.styleUrls;

      const sUrls = [].concat(styleUrls[styleType]);

      stylesMeta[styleType] = {
        externalStyles: sUrls.map(sUrl => {
          const externalStyle: ExternalStyleMeta = {
            originalComponentPath: sUrl
          };
          return externalStyle;
        })
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
