import { Component, Element, Method } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('element', () => {

  it('event normal ionChange event', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Element() el: HTMLElement;

      @Method()
      setClassNow() {
        this.el.classList.add('new-class');
      }
    }
    // @ts-ignore
    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a></cmp-a>
    `);

    await root.setClassNow();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a class="new-class"></cmp-a>
    `);
  });

});
