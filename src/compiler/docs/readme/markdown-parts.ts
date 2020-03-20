import * as d from '../../../declarations';
import { MarkdownTable } from './docs-util';

export const partsToMarkdown = (parts: d.JsonDocsSlot[]) => {
  const content: string[] = [];
  if (parts.length === 0) {
    return content;
  }

  content.push(`## Shadow Parts`);
  content.push(``);

  const table = new MarkdownTable();
  table.addHeader(['Part', 'Description']);

  parts.forEach(style => {
    table.addRow([style.name === '' ? '' : `\`"${style.name}"\``, style.docs]);
  });

  content.push(...table.toMarkdown());
  content.push(``);
  content.push(``);

  return content;
};
