import * as d from '@declarations';
import { dashToPascalCase } from '@utils';
import { generateEventTypes } from './generate-event-types';
import { generateMethodTypes } from './generate-method-types';
import { generatePropTypes } from './generate-prop-types';


/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmp the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export function generateComponentTypes(cmp: d.ComponentCompilerMeta, _importPath: string) {
  const tagName = cmp.tagName.toLowerCase();
  const tagNameAsPascal = dashToPascalCase(tagName);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;

  const propAttributes = generatePropTypes(cmp.properties);
  const methodAttributes = generateMethodTypes(cmp.methods);
  const eventAttributes = generateEventTypes(cmp.events);

  const stencilComponentAttributes = attributesToMultiLineString({
    ...propAttributes,
    ...methodAttributes
  }, false);

  const stencilComponentJSXAttributes = attributesToMultiLineString({
    ...propAttributes,
    ...eventAttributes
  }, true);

  const typesModule: d.TypesModule = {
    tagNameAsPascal: tagNameAsPascal,
    StencilComponents: `
interface ${tagNameAsPascal} {${
  stencilComponentAttributes !== '' ? `\n${stencilComponentAttributes}\n` : ''
}}`,
    JSXElements: `
interface ${jsxInterfaceName} extends JSXElements.HTMLAttributes {${
  stencilComponentJSXAttributes !== '' ? `\n${stencilComponentJSXAttributes}\n` : ''
}}`,
    global: `
interface ${interfaceName} extends Components.${tagNameAsPascal}, HTMLElement {}
var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};`,
    HTMLElementTagNameMap: `'${tagName}': ${interfaceName}`,
    ElementTagNameMap: `'${tagName}': ${interfaceName};`,
    IntrinsicElements: `'${tagName}': Components.${jsxInterfaceName};`
  };

  return typesModule;
}


function attributesToMultiLineString(attributes: d.TypeInfo, jsxAttributes: boolean, paddingString = '') {
  if (Object.keys(attributes).length === 0) {
    return '';
  }

  return Object.keys(attributes)
    .sort()
    .reduce((fullList, key) => {
      const type = attributes[key];
      if (type.public || !jsxAttributes) {
        if (type.jsdoc) {
          fullList.push(`/**`);
          fullList.push(` * ${type.jsdoc.replace(/\r?\n|\r/g, ' ')}`);
          fullList.push(` */`);
        }
        const optional = (jsxAttributes)
          ? !type.required
          : type.optional;

        fullList.push(`'${key}'${ optional ? '?' : '' }: ${type.type};`);
      }
      return fullList;
    }, <string[]>[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);
}
