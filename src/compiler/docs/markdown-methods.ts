import * as d from '../../declarations';
import { MarkdownTable, getMemberDocumentation } from './docs-util';


export class MarkdownMethods {
  private rows: Row[] = [];

  addRow(methodName: string, memberMeta: d.MemberMeta) {
    this.rows.push(new Row(methodName, memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.rows.length) {
      return content;
    }

    content.push(`## Methods`);
    content.push(``);

    this.rows = this.rows.sort((a, b) => {
      if (a.methodName < b.methodName) return -1;
      if (a.methodName > b.methodName) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader(['Method', 'Description']);

    this.rows.forEach(row => {
      table.addRow([
        '`' + row.methodName + '`',
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

  constructor(public methodName: string, private memberMeta: d.MemberMeta) {}

  get description() {
    return getMemberDocumentation(this.memberMeta.jsdoc);
  }

}
