import { EventMeta } from '../../util/interfaces';
import { getMemberDocumentation } from './docs-util';


export class MarkdownEvents {
  private rows: Row[] = [];

  addRow(eventMeta: EventMeta) {
    this.rows.push(new Row(eventMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.rows.length) {
      return content;
    }

    content.push(`## Events`);
    content.push(``);

    this.rows = this.rows.sort((a, b) => {
      if (a.eventMeta.eventName < b.eventMeta.eventName) return -1;
      if (a.eventMeta.eventName > b.eventMeta.eventName) return 1;
      return 0;
    });

    this.rows.forEach(row => {
      content.push(...row.toMarkdown());
    });

    return content;
  }
}


class Row {

  constructor(public eventMeta: EventMeta) {}

  toMarkdown() {
    const content: string[] = [];

    content.push(`#### ${this.eventMeta.eventName}`);
    content.push(``);

    const doc = getMemberDocumentation(this.eventMeta.jsdoc);
    if (doc) {
      content.push(doc);
      content.push(``);
    }

    content.push(``);

    return content;
  }
}
