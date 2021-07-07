import { MarkdownTable } from '../../docs/readme/docs-util';

describe('markdown-table', () => {
  it('header', () => {
    const t = new MarkdownTable();
    t.addHeader(['Column 1', 'Column 22', 'Column\n333']);
    t.addRow(['Text 1', 'Text 2']);
    const o = t.toMarkdown();
    expect(o).toEqual([
      '| Column 1 | Column 22 | Column 333 |',
      '| -------- | --------- | ---------- |',
      '| Text 1   | Text 2    |            |',
    ]);
  });

  it('longest column', () => {
    const t = new MarkdownTable();
    t.addRow(['Text aa', 'Text b', 'Text c']);
    t.addRow(['Text a', 'Text bb', 'Text c']);
    t.addRow(['Text a', 'Text bb', 'Text cc']);
    const o = t.toMarkdown();
    expect(o).toEqual([
      '| Text aa | Text b  | Text c  |',
      '| Text a  | Text bb | Text c  |',
      '| Text a  | Text bb | Text cc |',
    ]);
  });

  it('3 columns', () => {
    const t = new MarkdownTable();
    t.addRow(['Text 1', 'Text 2', 'Text 3']);
    const o = t.toMarkdown();
    expect(o).toEqual(['| Text 1 | Text 2 | Text 3 |']);
  });

  it('one column', () => {
    const t = new MarkdownTable();
    t.addRow(['Text']);
    const o = t.toMarkdown();
    expect(o).toEqual(['| Text |']);
  });

  it('do nothing', () => {
    const t = new MarkdownTable();
    const o = t.toMarkdown();
    expect(o).toEqual([]);
  });
});
