import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('prop', () => {

  it('override default values from attribute', async () => {
    @Component({ tag: 'cmp-a'})
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
      <cmp-a class="hydrated" bool-false="true" bool-true="false" str="attr" num="99">
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
    @Component({ tag: 'cmp-a'})
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
      <cmp-a class="hydrated">false-true-string-88</cmp-a>
    `);

    expect(root.textContent).toBe('false-true-string-88');
    expect(root.boolFalse).toBe(false);
    expect(root.boolTrue).toBe(true);
    expect(root.str).toBe('string');
    expect(root.num).toBe(88);
  });

});
