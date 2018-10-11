import { EventMeta } from '../../declarations';
import { MarkdownTable, getMemberDocumentation, isMemberInternal } from './docs-util';


export class MarkdownEvents {
  private rows: Row[] = [];

  addRow(eventMeta: EventMeta) {
    this.rows.push(new Row(eventMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    let rows = this.rows.filter(filterRow);
    if (rows.length === 0) {
      return content;
    }

    content.push(`## Events`);
    content.push(``);

    rows = rows.sort((a, b) => {
      if (a.eventMeta.eventName < b.eventMeta.eventName) return -1;
      if (a.eventMeta.eventName > b.eventMeta.eventName) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader(['Event', 'Description']);

    rows.forEach(row => {
      table.addRow([
        '`' + row.eventName + '`',
        row.description
      ]);
    });

    content.push(...table.toMarkdown());
    content.push(``);
    content.push(``);

    return content;
  }
}


class Row {

  constructor(public eventMeta: EventMeta) {}

  get eventName() {
    return this.eventMeta.eventName;
  }

  get description() {
    return getMemberDocumentation(this.eventMeta.jsdoc);
  }

}

function filterRow(row: Row) {
  return row.eventName[0] !== '_' && !isMemberInternal(row.eventMeta.jsdoc);
}
