import * as d from '../../declarations';
import { MarkdownTable, getMemberDocumentation, getMemberType, getMethodParameters, getMethodReturns } from './docs-util';


export class MarkdownMethods {
  private rows: Row[] = [];

  addRow(methodName: string, memberMeta: d.MemberMeta) {
    this.rows.push(new Row(methodName, memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    let rows = this.rows.filter(filterRow);
    if (rows.length === 0) {
      return content;
    }

    content.push(`## Methods`);
    content.push(``);

    // Sort methods by name
    rows = rows.sort((a, b) => {
      if (a.methodName < b.methodName) return -1;
      if (a.methodName > b.methodName) return 1;
      return 0;
    });

    rows.forEach(row => {
      content.push(`### ${row.signature}`);
      content.push(``);
      content.push(row.description);
      content.push(``);

      if (row.parameters.length > 0) {
        const parmsTable = new MarkdownTable();

        parmsTable.addHeader(['Name', 'Type', 'Description']);

        row.parameters.forEach(({ name, type, docs }) => {
          parmsTable.addRow(['`' + name + '`', '`' + type + '`', docs]);
        });

        content.push(`#### Parameters`);
        content.push(``);
        content.push(...parmsTable.toMarkdown());
        content.push(``);
      }

      if (row.returns) {
        content.push(`#### Returns`);
        content.push(``);
        content.push(`Type: \`${row.returns.type}\``);
        content.push(``);
        content.push(row.returns.docs);
        content.push(``);
      }
    });

    content.push(``);

    return content;
  }
}


class Row {

  constructor(public methodName: string, private memberMeta: d.MemberMeta) {}

  get description() {
    return getMemberDocumentation(this.memberMeta.jsdoc);
  }

  get signature() {
    const type = getMemberType(this.memberMeta.jsdoc);
    return '`' + this.methodName + type + '`';
  }

  get parameters() {
    return getMethodParameters(this.memberMeta.jsdoc);
  }

  get returns() {
    return getMethodReturns(this.memberMeta.jsdoc);
  }
}

function filterRow(row: Row) {
  return row.methodName[0] !== '_' && row.description.indexOf('@internal') < 0;
}
