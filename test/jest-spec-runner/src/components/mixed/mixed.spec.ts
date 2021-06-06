import { newSpecPage } from '@stencil/core/testing';
import { MyMixed } from './mixed';

describe('my-mixed', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MyMixed],
      html: '<my-mixed></my-mixed>',
    });
    expect(page.root).toEqualHtml(`
      <my-mixed>
        <span id="esm">
          deep esm!deep ts!
        </span>
        <span id="cjs">
          deep cjs!deep ts!
        </span>
        <span id="ts">
          deep esm!deep ts!
        </span>
      </my-mixed>
    `);
  });
});
