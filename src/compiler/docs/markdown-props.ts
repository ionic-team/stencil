import * as d from '../../declarations';
import { MarkdownTable, getMemberDocumentation } from './docs-util';
import { PROP_TYPE } from '../../util/constants';


export class MarkdownProps {
  private rows: PropRow[] = [];

  addRow(propName: string, memberMeta: d.MemberMeta) {
    this.rows.push(new PropRow(propName, memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    let rows = this.rows.filter(filterRow);
    if (rows.length === 0) {
      return content;
    }

    content.push(`## Properties`);
    content.push(``);

    rows = rows.sort((a, b) => {
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

    rows.forEach(row => {
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


export class PropRow {

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

    if (this.memberMeta.attribType && this.memberMeta.attribType.text) {
      if (!this.memberMeta.attribType.text.includes('(')) {
        const typeSplit = this.memberMeta.attribType.text.split('|').map(t => {
          return '`' + t.replace(/\'/g, '"').trim() + '`';
        });

        return typeSplit.join(', ');
      }

      return '`' + this.memberMeta.attribType.text + '`';
    }

    const propType = this.memberMeta.propType;

    switch (propType) {
      case PROP_TYPE.Any:
        return '`any`';

      case PROP_TYPE.Boolean:
        return '`boolean`';

      case PROP_TYPE.Number:
        return '`number`';

      case PROP_TYPE.String:
        return '`string`';
    }

    return '';
  }

}

function filterRow(row: PropRow) {
  return row.memberName[0] !== '_' && row.description.indexOf('@internal') < 0;
}
