import * as d from '../../declarations';
import { MarkdownTable, getMemberDocumentation } from './docs-util';


export class MarkdownMethods {
  private rows: Row[] = [];

  addRow(methodName: string, memberMeta: d.MemberMeta) {
    this.rows.push(new Row(methodName, memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    if (this.rows.length === 0) {
      return content;
    }

    content.push(`## Methods`);
    content.push(``);

    // Filter method that start with _
    let rows = this.rows.filter(row => row.methodName[0] !== '_');

    // Sort methods by name
    rows = rows.sort((a, b) => {
      if (a.methodName < b.methodName) return -1;
      if (a.methodName > b.methodName) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader(['Method', 'Description']);

    rows.forEach(row => {
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
