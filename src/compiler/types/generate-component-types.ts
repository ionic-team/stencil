import * as d from '@declarations';
import { dashToPascalCase, sortBy } from '@utils';
import { generateEventTypes } from './generate-event-types';
import { generateMethodTypes } from './generate-method-types';
import { generatePropTypes } from './generate-prop-types';


/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmp the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export function generateComponentTypes(cmp: d.ComponentCompilerMeta, _importPath: string): d.TypesModule {
  const tagName = cmp.tagName.toLowerCase();
  const tagNameAsPascal = dashToPascalCase(tagName);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;

  const propAttributes = generatePropTypes(cmp);
  const methodAttributes = generateMethodTypes(cmp.methods);
  const eventAttributes = generateEventTypes(cmp.events);

  const stencilComponentAttributes = attributesToMultiLineString([
    ...propAttributes,
    ...methodAttributes
  ], false);

  const stencilComponentJSXAttributes = attributesToMultiLineString([
    ...propAttributes,
    ...eventAttributes
  ], true);

  return {
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
interface ${interfaceName} extends Components.${tagNameAsPascal}, HTMLStencilElement {}
var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};`,
    HTMLElementTagNameMap: `'${tagName}': ${interfaceName}`,
    ElementTagNameMap: `'${tagName}': ${interfaceName};`,
    IntrinsicElements: `'${tagName}': Components.${jsxInterfaceName};`
  };
}


function attributesToMultiLineString(attributes: d.TypeInfo, jsxAttributes: boolean, paddingString = '') {
  return sortBy(attributes, a => a.name)
    .filter(type => type.public || !jsxAttributes)
    .reduce((fullList, type) => {
      if (type.jsdoc) {
        fullList.push(`/**`);
        fullList.push(` * ${type.jsdoc.replace(/\r?\n|\r/g, ' ')}`);
        fullList.push(` */`);
      }
      const optional = (jsxAttributes)
        ? !type.required
        : type.optional;

      fullList.push(`'${type.name}'${ optional ? '?' : '' }: ${type.type};`);
      return fullList;
    }, [] as string[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);
}
