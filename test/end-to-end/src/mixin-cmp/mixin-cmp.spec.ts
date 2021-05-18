import { MixinCmp } from './mixin-cmp';
import { newSpecPage } from '@stencil/core/testing';


describe('build-data', () => {

  it('should be able to test a mixin', async () => {
    const {root} = await newSpecPage({
      components: [MixinCmp],
      html: `<mixin-cmp></mixin-cmp>`
    });
    expect(root).toEqualHtml(`
      <mixin-cmp></mixin-cmp>
    `);
  });

});
