import { newSpecPage } from '@stencil/core/testing';
import { MySimple } from './simple';

describe('my-simple', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MySimple],
      html: '<my-simple></my-simple>',
    });
    expect(page.root).toEqualHtml(`
      <my-simple>
        <span>
          simple!
        </span>
      </my-simple>
    `);
  });
});
