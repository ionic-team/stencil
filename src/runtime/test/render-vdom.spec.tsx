import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('render-vdom', () => {

  @Component({ tag: 'cmp-a'})
  class CmpA {
    render() {
      return <div>Hello VDOM</div>;
    }
  }

  it('Hello VDOM, html option', async () => {
    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

  it('Hello VDOM, innerHTML, await flush', async () => {
    const { body, flush } = await newSpecPage({
      components: [CmpA]
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await flush();

    expect(body).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

});
