import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('render-vdom', () => {

  it('Hello VDOM, re-render, flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() excitement = '';
      render() {
        return <div>Hello VDOM{this.excitement}</div>;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);

    root.excitement = `!`;
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM!</div></cmp-a>
    `);

    root.excitement = `!!`;
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM!!</div></cmp-a>
    `);
  });

  it('Hello VDOM, html option', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <div>Hello VDOM</div>;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

  it('Hello VDOM, body.innerHTML, await flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <div>Hello VDOM</div>;
      }
    }

    const { body, waitForChanges } = await newSpecPage({
      components: [CmpA]
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await waitForChanges();

    expect(body).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

});
