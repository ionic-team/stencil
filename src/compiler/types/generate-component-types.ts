import type * as d from '../../declarations';
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

  const componentAttributes = attributesToMultiLineString([...propAttributes, ...methodAttributes], false, internal);
  const isDep = cmp.isCollectionDependency;
  const jsxAttributes = attributesToMultiLineString([...propAttributes, ...eventAttributes], true, internal);

  const element = [
    `        interface ${htmlElementName} extends Components.${tagNameAsPascal}, HTMLStencilElement {`,
    `        }`,
    `        var ${htmlElementName}: {`,
    `                prototype: ${htmlElementName};`,
    `                new (): ${htmlElementName};`,
    `        };`,
  ];
  return {
    isDep,
    tagName,
    tagNameAsPascal,
    htmlElementName,
    component: `        interface ${tagNameAsPascal} {\n${componentAttributes}        }`,
    jsx: `    interface ${tagNameAsPascal} {\n${jsxAttributes}        }`,
    element: element.join(`\n`),
  };
};

const attributesToMultiLineString = (attributes: d.TypeInfo, jsxAttributes: boolean, internal: boolean) => {
  const attributesStr = sortBy(attributes, (a) => a.name)
    .filter((type) => {
      if (jsxAttributes && !internal && type.internal) {
        return false;
      }
      return true;
    })
    .reduce((fullList, type) => {
      if (type.jsdoc) {
        fullList.push(`                /**`);
        fullList.push(...type.jsdoc.split('\n').map((line) => '                  * ' + line));
        fullList.push(`                 */`);
      }
      const optional = jsxAttributes ? !type.required : type.optional;
      fullList.push(`                "${type.name}"${optional ? '?' : ''}: ${type.type};`);
      return fullList;
    }, [] as string[])
    .join(`\n`);

  return attributesStr !== '' ? `${attributesStr}\n` : '';
};
