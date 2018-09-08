import * as d from '../../declarations';
import { MarkdownTable } from './docs-util';


export class MarkdownCssCustomProperties {
  private styleDocs: d.StyleDoc[] = [];

  addRow(styleDoc: d.StyleDoc) {
    this.styleDocs.push(styleDoc);
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.styleDocs.length) {
      return content;
    }

    content.push(`## CSS Custom Properties`);
    content.push(``);

    this.styleDocs = this.styleDocs.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader(['Name', 'Description']);

    this.styleDocs.forEach(styleDoc => {
      table.addRow([
        '`' + styleDoc.name + '`',
        styleDoc.docs
      ]);
    });

    content.push(...table.toMarkdown());
    content.push(``);
    content.push(``);

    return content;
  }
}
