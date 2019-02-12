import * as d from '../../../declarations';
import { buildWarn } from '../../util';
import { ENCAPSULATION } from '../../../util/constants';
import { getDeclarationParameters, isDecoratorNamed, serializeSymbol } from './utils';
import { getStylesMeta } from './styles-meta';
import ts from 'typescript';


export function getComponentDecoratorMeta(diagnostics: d.Diagnostic[], checker: ts.TypeChecker, node: ts.ClassDeclaration): d.ComponentMeta | undefined {
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

  const regex = new RegExp(/^[a-z](?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/);
  if (!regex.test(componentOptions.tag)) {
    throw new SyntaxError(`"${componentOptions.tag}" is not a valid tag name. Please refer to
    https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name for more info.`);
  }

  if (node.heritageClauses && node.heritageClauses.some(c => c.token === ts.SyntaxKind.ExtendsKeyword)) {
    throw new Error(`Classes decorated with @Component can not extend from a base class.
  Inherency is temporarily disabled for stencil components.`);
  }

  // check if class has more than one decorator
  if (node.decorators.length > 1) {
    throw new Error(`@Component({ tag: "${componentOptions.tag}" }) can not be decorated with more decorators at the same time`);
  }

  if (componentOptions.host) {
    const warn = buildWarn(diagnostics);
    warn.header = 'Host prop deprecated';
    warn.messageText = `The “host” property used in @Component({ tag: "${componentOptions.tag}" }) has been deprecated.
It will be removed in future versions. Please use the "hostData()" method instead. `;
  }

  const symbol = checker.getSymbolAtLocation(node.name);

  const cmpMeta: d.ComponentMeta = {
    tagNameMeta: componentOptions.tag,
    stylesMeta: getStylesMeta(componentOptions),
    assetsDirsMeta: [],
    hostMeta: getHostMeta(diagnostics, componentOptions.host),
    dependencies: [],
    jsdoc: serializeSymbol(checker, symbol)
  };

  // normalizeEncapsulation
  cmpMeta.encapsulationMeta =
      componentOptions.shadow ? ENCAPSULATION.ShadowDom :
      componentOptions.scoped ? ENCAPSULATION.ScopedCss :
      ENCAPSULATION.NoEncapsulation;

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


function getHostMeta(diagnostics: d.Diagnostic[], hostData: d.HostMeta) {
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

      const diagnostic = buildWarn(diagnostics);
      diagnostic.messageText = [
        `The @Component decorator's host property "${key}" has a type of "${itsType}". `,
        `However, a @Component decorator's "host" can only take static data, `,
        `such as a string, number or boolean. `,
        `Please use the "hostData()" method instead `,
        `if attributes or properties need to be dynamically added to `,
        `the host element.`
      ].join('');
    }
  });

  return hostData;
}
