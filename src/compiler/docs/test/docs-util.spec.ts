import { MarkdownTable, getPropType } from '../docs-util';
import { PROP_TYPE } from '../../../util/constants';

describe('markdown-table', () => {

  it('header', () => {
    const t = new MarkdownTable();
    t.addHeader(['Column 1', 'Column 22', 'Column\n333']);
    t.addRow(['Text 1', 'Text 2']);
    const o = t.toMarkdown();
    expect(o).toEqual([
      '| Column 1 | Column 22 | Column 333 |',
      '| -------- | --------- | ---------- |',
      '| Text 1   | Text 2    |            |'
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
      '| Text a  | Text bb | Text cc |'
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

describe('getPropType', () => {
  it('advanced union types', () => {
    const memberMeta = {
      attribType: {
        text: `(AlertButton | string)[]`,
        optional: false
      }
    }
    expect(getPropType(memberMeta)).toBe('(AlertButton | string)[]');
  });

  it('union types', () => {
    const memberMeta = {
      attribType: {
        text: `string | string[]`,
        optional: false
      }
    }
    expect(getPropType(memberMeta)).toBe('string, string[]');
  });

  it('string union types', () => {
    const memberMeta = {
      attribType: {
        text: `'submit' | 'reset' | 'button'`,
        optional: false
      }
    }

    expect(getPropType(memberMeta)).toBe('"submit", "reset", "button"');
  });

  it('any type', () => {
    const memberMeta = {
      propType: PROP_TYPE.Any
    }

    expect(getPropType(memberMeta)).toBe('any');
  });

  it('string type', () => {
    const memberMeta = {
      propType: PROP_TYPE.String
    }

    expect(getPropType(memberMeta)).toBe('string');
  });

  it('number type', () => {
    const memberMeta = {
      propType: PROP_TYPE.Number
    }

    expect(getPropType(memberMeta)).toBe('number');
  });

  it('boolean type', () => {
    const memberMeta = {
      propType: PROP_TYPE.Boolean
    }

    expect(getPropType(memberMeta)).toBe('boolean');
  });
})