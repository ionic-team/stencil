import type * as d from '../../../declarations';
import { MarkdownTable } from './docs-util';

export const propsToMarkdown = (props: d.JsonDocsProp[]) => {
  const content: string[] = [];
  if (props.length === 0) {
    return content;
  }

  content.push(`## Properties`);
  content.push(``);

  const table = new MarkdownTable();

  table.addHeader(['Property', 'Attribute', 'Description', 'Type', 'Default']);

  props.forEach((prop) => {
    table.addRow([
      getPropertyField(prop),
      getAttributeField(prop),
      getDocsField(prop),
      `<code>${prop.type}</code>`,
      `<code>${prop.default}</code>`,
    ]);
  });

  content.push(...table.toMarkdown());
  content.push(``);
  content.push(``);

  return content;
};

const getPropertyField = (prop: d.JsonDocsProp) => {
  return `<code>${prop.name}</code>${prop.required ? ' _(required)_' : ''}`;
};

const getAttributeField = (prop: d.JsonDocsProp) => {
  return prop.attr ? `<code>${prop.attr}</code>` : '--';
};

const getDocsField = (prop: d.JsonDocsProp) => {
  return `${
    prop.deprecation !== undefined
      ? `<span style="color:red">**[DEPRECATED]**</span> ${prop.deprecation}<br/><br/>`
      : ''
  }${prop.docs}`;
};
