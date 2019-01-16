import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('text-render', () => {

  it('Hello World, test inlined', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return 'Hello World';
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      build: {
        noVdomRender: true
      }
    });

    expect(body).toEqualHtml(`
      <cmp-a>Hello World</cmp-a>
    `);
  });

});
