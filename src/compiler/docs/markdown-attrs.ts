import { getMemberDocumentation } from './docs-util';
import { MemberMeta } from '../../declarations';
import { PROP_TYPE } from '../../util/constants';


export class MarkdownAttrs {
  private rows: Row[] = [];

  addRow(memberMeta: MemberMeta) {
    this.rows.push(new Row(memberMeta));
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.rows.length) {
      return content;
    }

    content.push(`## Attributes`);
    content.push(``);

    this.rows = this.rows.sort((a, b) => {
      if (a.memberMeta.attribName < b.memberMeta.attribName) return -1;
      if (a.memberMeta.attribName > b.memberMeta.attribName) return 1;
      return 0;
    });

    this.rows.forEach(row => {
      content.push(...row.toMarkdown());
    });

    return content;
  }
}


class Row {

  constructor(public memberMeta: MemberMeta) {}

  toMarkdown() {
    const content: string[] = [];

    content.push(`#### ${this.memberMeta.attribName}`);
    content.push(``);
    content.push(getPropType(this.memberMeta.propType));
    content.push(``);

    const doc = getMemberDocumentation(this.memberMeta.jsdoc);
    if (doc) {
      content.push(doc);
      content.push(``);
    }

    content.push(``);

    return content;
  }
}


function getPropType(propType: PROP_TYPE) {
  switch (propType) {
    case PROP_TYPE.Any:
      return 'any';
    case PROP_TYPE.Boolean:
      return 'boolean';
    case PROP_TYPE.Number:
      return 'number';
    case PROP_TYPE.String:
      return 'string';
  }
  return ''
}

