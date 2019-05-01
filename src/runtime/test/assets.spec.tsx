import { Component, getAssetPath } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('assets', () => {

  it('can call getAssetPath', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      componentWillLoad() {
        getAssetPath("foo.png");
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a></cmp-a>
    `);

    expect(root.textContent).toBe('');
  });

});
