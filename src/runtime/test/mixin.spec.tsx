import { newSpecPage } from '@stencil/core/testing';
import { CmpB } from './fixtures/cmp-b';

describe('mixin', () => {
  it('Can create mixin within newSpecPage', async () => {
    const { root } = await newSpecPage({
      components: [CmpB],
      html: `<cmp-b first="John" last="Snow"></cmp-b>`,
    });

    const div = root.shadowRoot.querySelector('div');
    expect(div.textContent).toEqual(`Hello, World! I'm John Snow`);
  });
});
