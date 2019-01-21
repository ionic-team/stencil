import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('prop', () => {

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
      <cmp-a>false-true-string-88</cmp-a>
    `);

    expect(root.textContent).toBe('false-true-string-88');
    expect(root.boolFalse).toBe(false);
    expect(root.boolTrue).toBe(true);
    expect(root.str).toBe('string');
    expect(root.num).toBe(88);
  });


});
