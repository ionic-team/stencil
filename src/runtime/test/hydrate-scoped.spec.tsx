import { Component, h, Host } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('hydrate scoped', () => {
  it('does not support shadow, slot, light dom', async () => {
    @Component({ tag: 'cmp-a', shadow: true })
    class CmpA {
      render() {
        return (
          <Host>
            <article>
              <slot />
            </article>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a>88mph</cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated" s-id="1">
        <!--r.1-->
        <!--o.0.1.-->
        <article c-id="1.0.0.0">
          <!--s.1.1.1.0..0.0-->
          <!--t.0.1-->
          88mph
        </article>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
      supportsShadowDom: false,
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated">
        <!--r.1-->
        <article>
          88mph
        </article>
      </cmp-a>
    `);
  });

  it('scoped, slot, light dom', async () => {
    @Component({ tag: 'cmp-a', scoped: true })
    class CmpA {
      render() {
        return (
          <Host>
            <article>
              <slot />
            </article>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a>88mph</cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated" s-id="1">
        <!--r.1-->
        <!--o.0.1.c-->
        <article c-id="1.0.0.0">
          <!--s.1.1.1.0..0.0-->
          <!--t.0.1-->
          88mph
        </article>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });
    expect(clientHydrated.root['s-id']).toBe('1');
    expect(clientHydrated.root['s-cr'].nodeType).toBe(8);
    expect(clientHydrated.root['s-cr']['s-cn']).toBe(true);

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated">
        <!--r.1-->
        <article class="sc-cmp-a-s">
          88mph
        </article>
      </cmp-a>
    `);
  });

  it('root element, no slot', async () => {
    @Component({ tag: 'cmp-a', scoped: true })
    class CmpA {
      render() {
        return (
          <Host>
            <p class="hi">Hello</p>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated" s-id="1">
        <!--r.1-->
        <p c-id="1.0.0.0" class="hi">
          <!--t.1.1.1.0-->
          Hello
        </p>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });
    expect(clientHydrated.root['s-id']).toBe('1');
    expect(clientHydrated.root['s-cr'].nodeType).toBe(8);
    expect(clientHydrated.root['s-cr']['s-cn']).toBe(true);

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a class="hydrated">
        <!--r.1-->
        <p class="hi">
          Hello
        </p>
      </cmp-a>
    `);
  });
});
