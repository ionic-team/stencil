import * as d from '../../declarations';
import { MarkdownTable } from './docs-util';


export function eventsToMarkdown(events: d.JsonDocsEvent[]) {

  const content: string[] = [];
  if (events.length === 0) {
    return content;
  }

  content.push(`## Events`);
  content.push(``);

  const table = new MarkdownTable();

  table.addHeader([
    'Event',
    'Description',
    'Detail'
  ]);

  events.forEach(ev => {
    table.addRow([
      `\`${ev.event}\``,
      ev.docs,
      ev.detail,
    ]);
  });

  content.push(...table.toMarkdown());
  content.push(``);
  content.push(``);

  return content;
}
