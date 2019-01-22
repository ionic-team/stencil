import { Component, Listen, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('listen', () => {

  it('listen to click on host, from elm.click()', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @State() clicks = 0;

      @Listen('click')
      buttonClick() {
        this.clicks++;
      }

      render() {
        return `${this.clicks}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    root.click();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    root.click();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

});
