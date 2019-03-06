import { Component, Host, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('hydrate no encapsulation', () => {

  it('simple', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <Host>
            <p class='hi'>Hello</p>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <p c-id="1.0" class="hi">
          <!--t.1.0-->
          Hello
          <!--/-->
        </p>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });
    expect(clientHydrated.root['s-id']).toBe('1');
    expect(clientHydrated.root['s-cr'].nodeType).toBe(8);
    expect(clientHydrated.root['s-cr']['s-cn']).toBe(true);

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <!--r.1-->
        <p class="hi">
          Hello
        </p>
      </cmp-a>
    `);
  });

  it('nested, text slot, footer', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <Host>
            <cmp-b>light-dom</cmp-b>
          </Host>
        );
      }
    }
    @Component({ tag: 'cmp-b' })
    class CmpB {
      render() {
        return (
          <Host>
            <slot></slot>
            <footer></footer>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id=\"1\">
        <!--r.1-->
        <cmp-b c-id=\"1.0\" s-id=\"2\">
          <!--r.2-->
          <!--s.2.0-->
          <!--t.1.0-->
          light-dom
          <!--/-->
          <footer c-id=\"2.1\"></footer>
        </cmp-b>
      </cmp-a>
    `);

    // // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <!--r.1-->
        <cmp-b>
          <!--r.2-->
          <!--s.2.0-->
          light-dom
          <footer></footer>
        </cmp-b>
      </cmp-a>
    `);
  });

  it('nested, text slot, header', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <Host>
            <cmp-b>light-dom</cmp-b>
          </Host>
        );
      }
    }
    @Component({ tag: 'cmp-b' })
    class CmpB {
      render() {
        return (
          <Host>
            <header></header>
            <slot></slot>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id=\"1\">
        <!--r.1-->
        <cmp-b c-id=\"1.0\" s-id=\"2\">
          <!--r.2-->
          <header c-id=\"2.0\"></header>
          <!--s.2.1-->
          <!--t.1.0-->
          light-dom
          <!--/-->
        </cmp-b>
      </cmp-a>
    `);

    // // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <!--r.1-->
        <cmp-b>
          <!--r.2-->
          <header></header>
          <!--s.2.1-->
          light-dom
        </cmp-b>
      </cmp-a>
    `);
  });

it('nested, text slot, header/footer', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <Host>
            <cmp-b>light-dom</cmp-b>
          </Host>
        );
      }
    }
    @Component({ tag: 'cmp-b' })
    class CmpB {
      render() {
        return (
          <Host>
            <header></header>
            <slot></slot>
            <footer></footer>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id=\"1\">
        <!--r.1-->
        <cmp-b c-id=\"1.0\" s-id=\"2\">
          <!--r.2-->
          <header c-id=\"2.0\"></header>
          <!--s.2.1-->
          <!--t.1.0-->
          light-dom
          <!--/-->
          <footer c-id=\"2.2\"></footer>
        </cmp-b>
      </cmp-a>
    `);

    // // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <!--r.1-->
        <cmp-b>
          <!--r.2-->
          <header></header>
          <!--s.2.1-->
          light-dom
          <footer></footer>
        </cmp-b>
      </cmp-a>
    `);
  });

});
