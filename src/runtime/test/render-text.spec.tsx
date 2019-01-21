import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('render-text', () => {

  @Component({ tag: 'cmp-a'})
  class CmpA {
    render() {
      return 'Hello World';
    }
  }

  it('Hello World, html option', async () => {
    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
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
      components: [CmpA]
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await flush();

    expect(body).toEqualHtml(`
      <cmp-a>Hello World</cmp-a>
    `);
  });

});
