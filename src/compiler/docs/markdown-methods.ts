

export class MarkdownMethods {
  private rows: Row[] = [];

  addRow(memberName: string) {
    this.rows.push(new Row(memberName));
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.rows.length) {
      return content;
    }

    content.push(`## Methods`);
    content.push(``);

    this.rows = this.rows.sort((a, b) => {
      if (a.memberName < b.memberName) return -1;
      if (a.memberName > b.memberName) return 1;
      return 0;
    });

    this.rows.forEach(row => {
      content.push(...row.toMarkdown());
    });

    return content;
  }
}


class Row {

  constructor(public memberName: string) {}

  toMarkdown() {
    const content: string[] = [];

    content.push(`#### ${this.memberName}()`);
    content.push(``);
    content.push(``);

    return content;
  }
}
