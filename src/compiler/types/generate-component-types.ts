import { dashToPascalCase, getTextDocs, sortBy } from '@utils';

import type * as d from '../../declarations';
import { generateEventTypes } from './generate-event-types';
import { generateMethodTypes } from './generate-method-types';
import { generatePropTypes } from './generate-prop-types';

/**
 * Generate a string based on the types that are defined within a component
 * @param cmp the metadata for the component that a type definition string is generated for
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @param areTypesInternal `true` if types being generated are for a project's internal purposes, `false` otherwise
 * @returns the generated types string alongside additional metadata
 */
export const generateComponentTypes = (
  cmp: d.ComponentCompilerMeta,
  typeImportData: d.TypesImportData,
  areTypesInternal: boolean
): d.TypesModule => {
  const tagName = cmp.tagName.toLowerCase();
  const tagNameAsPascal = dashToPascalCase(tagName);
  const htmlElementName = `HTML${tagNameAsPascal}Element`;

  const componentDocs = getTextDocs(cmp.docs);
  const componentComment = indentDocComment(componentDocs, 8);
  const jsxComment = indentDocComment(componentDocs, 4);

  const propAttributes = generatePropTypes(cmp, typeImportData);
  const methodAttributes = generateMethodTypes(cmp, typeImportData);
  const eventAttributes = generateEventTypes(cmp, typeImportData, tagNameAsPascal);

  const componentAttributes = attributesToMultiLineString(
    [...propAttributes, ...methodAttributes],
    false,
    areTypesInternal
  );
  const isDep = cmp.isCollectionDependency;
  const jsxAttributes = attributesToMultiLineString([...propAttributes, ...eventAttributes], true, areTypesInternal);

  const component = [
    componentComment,
    `        interface ${tagNameAsPascal} {`,
    `${componentAttributes}        }`,
  ].filter(Boolean);

  const jsx = [jsxComment, `    interface ${tagNameAsPascal} {`, `${jsxAttributes}        }`].filter(Boolean);

  const element = [
    componentComment,
    `        interface ${htmlElementName} extends Components.${tagNameAsPascal}, HTMLStencilElement {`,
    `        }`,
    componentComment,
    `        var ${htmlElementName}: {`,
    `                prototype: ${htmlElementName};`,
    `                new (): ${htmlElementName};`,
    `        };`,
  ].filter(Boolean);

  return {
    isDep,
    tagName,
    tagNameAsPascal,
    htmlElementName,
    component: component.join(`\n`),
    jsx: jsx.join(`\n`),
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
        fullList.push(indentDocComment(type.jsdoc, 16));
      }
      const optional = jsxAttributes ? !type.required : type.optional;
      fullList.push(`                "${type.name}"${optional ? '?' : ''}: ${type.type};`);
      return fullList;
    }, [] as string[])
    .join(`\n`);

  return attributesStr !== '' ? `${attributesStr}\n` : '';
};

const indentDocComment = (text: string, indent: number): string => {
  if (!text) return '';

  const spaces = ' '.repeat(indent);
  return [`${spaces}/**`, ...text.split('\n').map((line) => `${spaces}  * ${line}`), `${spaces} */`].join('\n');
};
