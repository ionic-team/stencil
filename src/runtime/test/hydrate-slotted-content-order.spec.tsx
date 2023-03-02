import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { patchPseudoShadowDom } from '../../runtime/dom-extras';

describe('hydrated, components slotted nodes should match the original order they were slotted', () => {
  const nodeOrEle = (node: Node | Element) => {
    if (!node) return '';
    return (node as Element).outerHTML || node.nodeValue;
  };

  it('Shadow. Default slot', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true,
    })
    class CmpA {
      render() {
        return (
          <main>
            <slot />
          </main>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
      <cmp-a><p>slotted item 1</p><!-- a comment --!><p>slotted item 2</p>A text node<p>slotted item 3</p><!-- another comment --!></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1.-->
      <!--o.0.2.-->
      <!--o.0.3.-->
      <!--o.0.4.-->
      <!--o.0.5.-->
      <!--o.0.6.-->
      <main c-id=\"1.0.0.0\">
        <!--s.1.1.1.0..0.0-->
        <p c-id=\"0.1\" s-sn=\"\">
          slotted item 1
        </p>
        <!--c.0.2-->
        <!-- a comment -->
        <p c-id=\"0.3\" s-sn=\"\">
          slotted item 2
        </p>
        <!--t.0.4-->
        A text node
        <p c-id=\"0.5\" s-sn=\"\">
          slotted item 3
        </p>
        <!--c.0.6-->
        <!-- another comment -->
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    const childNodes = clientHydrated.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(`<p>slotted item 1</p>`);
    expect(nodeOrEle(childNodes[1])).toBe(` a comment `);
    expect(nodeOrEle(childNodes[2])).toBe(`<p>slotted item 2</p>`);
    expect(nodeOrEle(childNodes[3])).toBe(`A text node`);
    expect(nodeOrEle(childNodes[4])).toBe(`<p>slotted item 3</p>`);
    expect(nodeOrEle(childNodes[5])).toBe(` another comment `);
  });

  it('Shadow. Multiple slots', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true,
    })
    class CmpA {
      render() {
        return (
          <main>
            <aside>
              <slot name="second" />
            </aside>
            <section>
              <slot />
            </section>
          </main>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
      <cmp-a><!-- comment node --> Default slot <p slot="second">second slot</p><!-- another comment node --></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1.-->
      <!--o.0.2.-->
      <!--o.0.3.-->
      <!--o.0.4.-->
      <main c-id=\"1.0.0.0\">
        <aside c-id=\"1.1.1.0\">
          <!--s.1.2.2.0.second.0.0-->
          <p c-id=\"0.3\" s-sn=\"second\" slot=\"second\">
            second slot
          </p>
        </aside>
        <section c-id=\"1.3.1.1\">
          <!--s.1.4.2.0..0.0-->
          <!--c.0.1-->
          <!-- comment node -->
          <!--t.0.2-->
          Default slot
          <!--c.0.4-->
          <!-- another comment node -->
        </section>
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    expect(clientHydrated.root.outerHTML).toEqualHtml(`
    <cmp-a class=\"hydrated\">
      <!-- comment node -->
      Default slot
      <p slot=\"second\">
        second slot
      </p>
      <!-- another comment node -->
    </cmp-a>`);

    const childNodes = clientHydrated.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(` comment node `);
    expect(nodeOrEle(childNodes[1])).toBe(` Default slot `);
    expect(nodeOrEle(childNodes[2])).toBe(`<p slot=\"second\">second slot</p>`);
    expect(nodeOrEle(childNodes[3])).toBe(` another comment node `);
  });

  it('Shadow. Nested components', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true,
    })
    class CmpA {
      render() {
        return (
          <main>
            <slot />
          </main>
        );
      }
    }

    @Component({
      tag: 'cmp-b',
      shadow: true,
    })
    class CmpB {
      render() {
        return (
          <section>
            <slot />
          </section>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `
      <cmp-a><p>slotted item 1a</p><!-- a comment --!>A text node<!-- another comment a--!><cmp-b><p>slotted item 1b</p><!-- b comment --!>B text node<!-- another comment b--!></cmp-b></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1.-->
      <!--o.0.2.-->
      <!--o.0.3.-->
      <!--o.0.4.-->
      <!--o.0.5.-->
      <main c-id=\"1.0.0.0\">
        <!--s.1.1.1.0..0.0-->
        <p c-id=\"0.1\" s-sn=\"\">
          slotted item 1a
        </p>
        <!--c.0.2-->
        <!-- a comment -->
        <!--t.0.3-->
        A text node
        <!--c.0.4-->
        <!-- another comment a-->
        <cmp-b c-id=\"0.5\" class=\"hydrated\" s-id=\"2\" s-sn=\"\">
          <!--r.2-->
          <!--o.0.6.-->
          <!--o.0.7.-->
          <!--o.0.8.-->
          <!--o.0.9.-->
          <section c-id=\"2.0.0.0\">
            <!--s.2.1.1.0..0.0-->
            <p c-id=\"0.6\" s-sn=\"\">
              slotted item 1b
            </p>
            <!--c.0.7-->
            <!-- b comment -->
            <!--t.0.8-->
            B text node
            <!--c.0.9-->
            <!-- another comment b-->
          </section>
        </cmp-b>
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    const childNodes = clientHydrated.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(`<p>slotted item 1a</p>`);
    expect(nodeOrEle(childNodes[1])).toBe(` a comment `);
    expect(nodeOrEle(childNodes[2])).toBe(`A text node`);
    expect(nodeOrEle(childNodes[3])).toBe(` another comment a`);
    expect(nodeOrEle(childNodes[4].childNodes[0])).toBe(`<p>slotted item 1b</p>`);
    expect(nodeOrEle(childNodes[4].childNodes[1])).toBe(` b comment `);
    expect(nodeOrEle(childNodes[4].childNodes[2])).toBe(`B text node`);
    expect(nodeOrEle(childNodes[4].childNodes[3])).toBe(` another comment b`);
  });

  it('Non-Shadow. Default slot', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: false,
    })
    class CmpA {
      render() {
        return (
          <main>
            <slot />
          </main>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
      <cmp-a><p>slotted item 1</p><!-- a comment --!><p>slotted item 2</p>A text node<p>slotted item 3</p><!-- another comment --!></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1-->
      <!--o.0.2-->
      <!--o.0.3-->
      <!--o.0.4-->
      <!--o.0.5-->
      <!--o.0.6-->
      <main c-id=\"1.0.0.0\">
        <!--s.1.1.1.0..0.0-->
        <p c-id=\"0.1\" s-sn=\"\">
          slotted item 1
        </p>
        <!--c.0.2-->
        <!-- a comment -->
        <p c-id=\"0.3\" s-sn=\"\">
          slotted item 2
        </p>
        <!--t.0.4-->
        A text node
        <p c-id=\"0.5\" s-sn=\"\">
          slotted item 3
        </p>
        <!--c.0.6-->
        <!-- another comment -->
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    // patches this element in the same way we patch all elements in the browser
    patchPseudoShadowDom(clientHydrated.root, clientHydrated.root);

    const childNodes = clientHydrated.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(`<p>slotted item 1</p>`);
    expect(nodeOrEle(childNodes[1])).toBe(` a comment `);
    expect(nodeOrEle(childNodes[2])).toBe(`<p>slotted item 2</p>`);
    expect(nodeOrEle(childNodes[3])).toBe(`A text node`);
    expect(nodeOrEle(childNodes[4])).toBe(`<p>slotted item 3</p>`);
    expect(nodeOrEle(childNodes[5])).toBe(` another comment `);
  });

  it('Non-Shadow. Multiple slots', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: false,
    })
    class CmpA {
      render() {
        return (
          <main>
            <aside>
              <slot name="second" />
            </aside>
            <section>
              <slot />
            </section>
          </main>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
      <cmp-a><!-- comment node --> Default slot <p slot="second">second slot</p><!-- another comment node --></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1-->
      <!--o.0.2-->
      <!--o.0.3-->
      <!--o.0.4-->
      <main c-id=\"1.0.0.0\">
        <aside c-id=\"1.1.1.0\">
          <!--s.1.2.2.0.second.0.0-->
          <p c-id=\"0.3\" s-sn=\"second\" slot=\"second\">
            second slot
          </p>
        </aside>
        <section c-id=\"1.3.1.1\">
          <!--s.1.4.2.0..0.0-->
          <!--c.0.1-->
          <!-- comment node -->
          <!--t.0.2-->
          Default slot
          <!--c.0.4-->
          <!-- another comment node -->
        </section>
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    // patches this element in the same way we patch all elements in the browser
    patchPseudoShadowDom(clientHydrated.root, clientHydrated.root);

    const childNodes = clientHydrated.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(` comment node `);
    expect(nodeOrEle(childNodes[1])).toBe(` Default slot `);
    expect(nodeOrEle(childNodes[2])).toBe(`<p slot=\"second\">second slot</p>`);
    expect(nodeOrEle(childNodes[3])).toBe(` another comment node `);
  });

  it('Non-Shadow. Nested components', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: false,
    })
    class CmpA {
      render() {
        return (
          <main>
            <slot />
          </main>
        );
      }
    }

    @Component({
      tag: 'cmp-b',
      shadow: false,
    })
    class CmpB {
      render() {
        return (
          <section>
            <slot />
          </section>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `
      <cmp-a><p>slotted item 1a</p><!-- a comment --!>A text node<!-- another comment a--!><cmp-b><p>slotted item 1b</p><!-- b comment --!>B text node<!-- another comment b--!></cmp-b></cmp-a>
      `,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1-->
      <!--o.0.2-->
      <!--o.0.3-->
      <!--o.0.4-->
      <!--o.0.5-->
      <main c-id=\"1.0.0.0\">
        <!--s.1.1.1.0..0.0-->
        <p c-id=\"0.1\" s-sn=\"\">
          slotted item 1a
        </p>
        <!--c.0.2-->
        <!-- a comment -->
        <!--t.0.3-->
        A text node
        <!--c.0.4-->
        <!-- another comment a-->
        <cmp-b c-id=\"0.5\" class=\"hydrated\" s-id=\"2\" s-sn=\"\">
          <!--r.2-->
          <!--o.0.6-->
          <!--o.0.7-->
          <!--o.0.8-->
          <!--o.0.9-->
          <section c-id=\"2.0.0.0\">
            <!--s.2.1.1.0..0.0-->
            <p c-id=\"0.6\" s-sn=\"\">
              slotted item 1b
            </p>
            <!--c.0.7-->
            <!-- b comment -->
            <!--t.0.8-->
            B text node
            <!--c.0.9-->
            <!-- another comment b-->
          </section>
        </cmp-b>
      </main>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    // patches this element in the same way we patch all elements in the browser
    patchPseudoShadowDom(clientHydrated.root, clientHydrated.root);

    const childNodes = clientHydrated.root.childNodes;

    patchPseudoShadowDom(childNodes[4], childNodes[4]);

    expect(nodeOrEle(childNodes[0])).toBe(`<p>slotted item 1a</p>`);
    expect(nodeOrEle(childNodes[1])).toBe(` a comment `);
    expect(nodeOrEle(childNodes[2])).toBe(`A text node`);
    expect(nodeOrEle(childNodes[3])).toBe(` another comment a`);
    expect(nodeOrEle(childNodes[4].childNodes[0])).toBe(`<p>slotted item 1b</p>`);
    expect(nodeOrEle(childNodes[4].childNodes[1])).toBe(` b comment `);
    expect(nodeOrEle(childNodes[4].childNodes[2])).toBe(`B text node`);
    expect(nodeOrEle(childNodes[4].childNodes[3])).toBe(` another comment b`);
  });
});
