import * as d from '../../declarations';
import { MarkdownTable } from './docs-util';


export class MarkdownCssCustomProperties {
  private cssProps: d.CssCustomProperty[] = [];

  addRow(cssProp: d.CssCustomProperty) {
    this.cssProps.push(cssProp);
  }

  toMarkdown() {
    const content: string[] = [];
    if (!this.cssProps.length) {
      return content;
    }

    content.push(`## CSS Custom Properties`);
    content.push(``);

    this.cssProps = this.cssProps.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const table = new MarkdownTable();

    table.addHeader(['Name', 'Description']);

    this.cssProps.forEach(cssProp => {
      table.addRow([
        '`' + cssProp.name + '`',
        cssProp.docs
      ]);
    });

    content.push(...table.toMarkdown());
    content.push(``);

    return content;
  }
}
