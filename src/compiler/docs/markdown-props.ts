import * as d from '../../declarations';
import { MarkdownTable } from './docs-util';

export function propsToMarkdown(props: d.JsonDocsProp[]) {
  const content: string[] = [];
  if (props.length === 0) {
    return content;
  }

  content.push(`## Properties`);
  content.push(``);

  const table = new MarkdownTable();

  table.addHeader([
    'Property',
    'Attribute',
    'Description',
    'Type',
    'Default'
  ]);

  props.forEach(prop => {
    table.addRow([
      `\`${prop.name}\``,
      prop.attr ? `\`${prop.attr}\`` : '--',
      prop.docs,
      `\`${prop.type}\``,
      `\`${prop.default}\``
    ]);
  });

  content.push(...table.toMarkdown());
  content.push(``);
  content.push(``);

  return content;
}
