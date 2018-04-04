import * as d from '../../../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../../../util/constants';
import { getDeclarationParameters, isDecoratorNamed, serializeSymbol } from './utils';
import * as ts from 'typescript';


export function getComponentDecoratorMeta(config: d.Config, checker: ts.TypeChecker, node: ts.ClassDeclaration): d.ComponentMeta | undefined {
  if (!node.decorators) {
    return undefined;
  }

  const componentDecorator = node.decorators.find(isDecoratorNamed('Component'));
  if (!componentDecorator) {
    return undefined;
  }

  const [ componentOptions ] = getDeclarationParameters<d.ComponentOptions>(componentDecorator);

  if (!componentOptions.tag || componentOptions.tag.trim() === '') {
    throw new Error(`tag missing in component decorator: ${JSON.stringify(componentOptions, null, 2)}`);
  }

  const symbol = checker.getSymbolAtLocation(node.name);

  const cmpMeta: d.ComponentMeta = {
    tagNameMeta: componentOptions.tag,
    stylesMeta: {},
    assetsDirsMeta: [],
    hostMeta: getHostMeta(config, componentOptions.host),
    dependencies: [],
    jsdoc: serializeSymbol(checker, symbol)
  };

  // normalizeEncapsulation
  cmpMeta.encapsulation =
      componentOptions.shadow ? ENCAPSULATION.ShadowDom :
      componentOptions.scoped ? ENCAPSULATION.ScopedCss :
      ENCAPSULATION.NoEncapsulation;

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
          const externalStyle: d.ExternalStyleMeta = {
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
      const styleUrls = componentOptions.styleUrls as d.ModeStyles;

      const sUrls = [].concat(styleUrls[styleType]);

      stylesMeta[styleType] = {
        externalStyles: sUrls.map(sUrl => {
          const externalStyle: d.ExternalStyleMeta = {
            originalComponentPath: sUrl
          };
          return externalStyle;
        })
      };

      return stylesMeta;
    }, cmpMeta.stylesMeta);
  }

  // assetsDir: './somedir'
  if (componentOptions.assetsDir) {
    const assetsMeta: d.AssetsMeta = {
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


function getHostMeta(config: d.Config, hostData: d.HostMeta) {
  hostData = hostData || {};

  Object.keys(hostData).forEach(key => {
    const type = typeof hostData[key];

    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      // invalid data
      delete hostData[key];

      let itsType = 'object';
      if (type === 'function') {
        itsType = 'function';

      } else if (Array.isArray(hostData[key])) {
        itsType = 'Array';
      }

      config.logger.warn([
        `The @Component decorator's host property "${key}" has a type of "${itsType}". `,
        `However, a @Component decorator's "host" can only take static data, `,
        `such as a string, number or boolean. `,
        `Please use the "hostData()" method instead `,
        `if attributes or properties need to be dynamically added to `,
        `the host element.`
      ].join(''));
    }
  });

  return hostData;
}
