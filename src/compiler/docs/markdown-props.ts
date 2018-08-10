import * as d from '../../declarations';
import { MarkdownTable, getMemberDocumentation } from './docs-util';
import { PROP_TYPE } from '../../util/constants';


export class MarkdownProps {
  private rows: Row[] = [];

  addRow(propName: string, memberMeta: d.MemberMeta) {
    this.rows.push(new Row(propName, memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.rows.length) {
      return content;
    }

    content.push(`## Properties`);
    content.push(``);

    this.rows = this.rows.sort((a, b) => {
      if (a.propName < b.propName) return -1;
      if (a.propName > b.propName) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader([
      'Property',
      'Attribute',
      'Description',
      'Type'
    ]);

    this.rows.forEach(row => {
      table.addRow([
        row.propName,
        row.attrName,
        row.description,
        row.type
      ]);
    });

    content.push(...table.toMarkdown());
    content.push(``);
    content.push(``);


    return content;
  }
}


class Row {

  constructor(public memberName: string, private memberMeta: d.MemberMeta) {}

  get propName() {
    return '`' + this.memberName + '`';
  }

  get attrName() {
    if (this.memberMeta.attribName) {
      const propType = this.memberMeta.propType;

      if (propType === PROP_TYPE.Boolean || propType === PROP_TYPE.Number || propType === PROP_TYPE.String) {
        return '`' + this.memberMeta.attribName + '`';
      }
    }
    return '--';
  }

  get description() {
    return getMemberDocumentation(this.memberMeta.jsdoc);
  }

  get type() {
    let type = '';
    const propType = this.memberMeta.propType;

    switch (propType) {
      case PROP_TYPE.Any:
        type = 'any';
        break;

      case PROP_TYPE.Boolean:
        type = 'boolean';
        break;

      case PROP_TYPE.Number:
        type = 'number';
        break;

      case PROP_TYPE.String:
        type = 'string';
        break;
    }

    type = this.memberMeta.attribType.text;

    if (type) {
      return '`' + type + '`';
    }

    return type;
  }

}
