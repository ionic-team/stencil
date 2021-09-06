import { MixinCmp } from './mixin-cmp';
import { newSpecPage } from '@stencil/core/testing';

describe('mixin-spec', () => {
  it('should be able to test a mixin', async () => {
    const { root } = await newSpecPage({
      components: [MixinCmp],
      html: `<mixin-cmp></mixin-cmp>`,
    });
    expect(root).toEqualHtml(`
      <mixin-cmp class="button button-solid ion-activatable ion-focusable undefined">
       <mock:shadow-root>
         <button class="button-native" part="native" type="button">
           <span class="button-inner">
             <slot name="icon-only"></slot>
             <slot name="start"></slot>
             <slot></slot>
             <slot name="end"></slot>
           </span>
         </button>
       </mock:shadow-root>
        <div style="background-color: rgba(0, 0, 255, 0.1);">
          Jonny B Good
        </div>
      </mixin-cmp>
    `);
  });
});
