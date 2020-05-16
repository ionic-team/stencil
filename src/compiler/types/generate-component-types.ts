import * as d from '../../declarations';
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
export const generateComponentTypes = (cmp: d.ComponentCompilerMeta, internal: boolean): d.TypesModule => {
  const tagName = cmp.tagName.toLowerCase();
  const tagNameAsPascal = dashToPascalCase(tagName);
  const htmlElementName = `HTML${tagNameAsPascal}Element`;

  const propAttributes = generatePropTypes(cmp);
  const methodAttributes = generateMethodTypes(cmp.methods);
  const eventAttributes = generateEventTypes(cmp.events);

  const stencilComponentAttributes = attributesToMultiLineString([...propAttributes, ...methodAttributes], false, internal);
  const isDep = cmp.isCollectionDependency;
  const stencilComponentJSXAttributes = attributesToMultiLineString([...propAttributes, ...eventAttributes], true, internal);
  return {
    isDep,
    tagName,
    tagNameAsPascal,
    htmlElementName,
    component: `interface ${tagNameAsPascal} {${stencilComponentAttributes}}`,
    jsx: `interface ${tagNameAsPascal} {${stencilComponentJSXAttributes}}`,
    element: `
interface ${htmlElementName} extends Components.${tagNameAsPascal}, HTMLStencilElement {}
var ${htmlElementName}: {
  prototype: ${htmlElementName};
  new (): ${htmlElementName};
};`,
  };
};

const attributesToMultiLineString = (attributes: d.TypeInfo, jsxAttributes: boolean, internal: boolean) => {
  const paddingString = '';
  const attributesStr = sortBy(attributes, a => a.name)
    .filter(type => {
      if (jsxAttributes && !internal && type.internal) {
        return false;
      }
      return true;
    })
    .reduce((fullList, type) => {
      if (type.jsdoc) {
        fullList.push(`/**`);
        fullList.push(...type.jsdoc.split('\n').map(line => '  * ' + line));
        fullList.push(` */`);
      }
      const optional = jsxAttributes ? !type.required : type.optional;
      fullList.push(`'${type.name}'${optional ? '?' : ''}: ${type.type};`);
      return fullList;
    }, [] as string[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);

  return attributesStr !== '' ? `\n${attributesStr}\n` : '';
};
