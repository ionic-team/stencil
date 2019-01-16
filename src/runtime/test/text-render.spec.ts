import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('text-render', () => {

  it('Hello World, html option', async () => {
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

  it('Hello World, innerHTML, await flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return 'Hello World';
      }
    }

    const { body, flush } = await newSpecPage({
      components: [CmpA],
      build: {
        noVdomRender: true
      }
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await flush();

    expect(body).toEqualHtml(`
      <cmp-a>Hello World</cmp-a>
    `);
  });

});
