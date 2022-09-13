import { Component, h, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('prop', () => {
  it('"value" attribute', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Prop() value: string;

      render() {
        return <code>{this.value.trim()}</code>;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a value="#005a00"></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a value="#005a00">
        <code>#005a00</code>
      </cmp-a>
    `);
  });

  it('override default values from attribute', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Prop() boolFalse = false;
      @Prop() boolTrue = true;
      @Prop() str = 'string';
      @Prop() num = 88;
      render() {
        return `${this.boolFalse}-${this.boolTrue}-${this.str}-${this.num}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a bool-false="true" bool-true="false" str="attr" num="99"></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a bool-false="true" bool-true="false" str="attr" num="99">
        true-false-attr-99
      </cmp-a>
    `);

    expect(root.textContent).toBe('true-false-attr-99');
    expect(root.boolFalse).toBe(true);
    expect(root.boolTrue).toBe(false);
    expect(root.str).toBe('attr');
    expect(root.num).toBe(99);
  });

  it('set default values', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Prop() boolFalse = false;
      @Prop() boolTrue = true;
      @Prop() str = 'string';
      @Prop() num = 88;
      render() {
        return `${this.boolFalse}-${this.boolTrue}-${this.str}-${this.num}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>false-true-string-88</cmp-a>
    `);

    expect(root.textContent).toBe('false-true-string-88');
    expect(root.boolFalse).toBe(false);
    expect(root.boolTrue).toBe(true);
    expect(root.str).toBe('string');
    expect(root.num).toBe(88);
  });

  it('only update on even numbers', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Prop() num = 1;

      componentShouldUpdate(newValue: number, _: number, propName: string) {
        if (propName === 'num') {
          return newValue % 2 === 0;
        }
        return true;
      }
      render() {
        return `${this.num}`;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    root.num++;
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
    root.num++;
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
    root.num++;
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>4</cmp-a>
    `);
  });
});
