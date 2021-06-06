import { Component, Method, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('state', () => {
  it('set default values, update on re-render', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @State() boolFalse = false;
      @State() boolTrue = true;
      @State() str = 'string';
      @State() num = 88;

      @Method()
      async update() {
        (this.boolFalse = true), (this.boolTrue = false);
        this.str = 'hello';
        this.num = 99;
      }

      render() {
        return `${this.boolFalse}-${this.boolTrue}-${this.str}-${this.num}`;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>false-true-string-88</cmp-a>
    `);

    expect(root.textContent).toBe('false-true-string-88');
    expect(root.boolFalse).toBe(undefined);
    expect(root.boolTrue).toBe(undefined);
    expect(root.str).toBe(undefined);
    expect(root.num).toBe(undefined);

    await root.update();
    await waitForChanges();

    expect(root.textContent).toBe('true-false-hello-99');
  });
});
