import { newSpecPage } from '@stencil/core/testing';
import { MyMixed } from './mixed';
import { expect } from '@jest/globals';

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
          deep cjs!Cannot require(ESM file) from CJS file
        </span>
        <span id="ts">
          deep esm!deep ts!
        </span>
      </my-mixed>
    `);
  });
});
