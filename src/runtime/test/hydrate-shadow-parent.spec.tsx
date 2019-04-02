import { Component, Host, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('hydrate, shadow parent', () => {

  it('slot depth 1, text w/out vdom', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true
    })
    class CmpA {
      render() {
        return (
          <Host>
            <div>
              <slot></slot>
            </div>
          </Host>
        );
      }
    }

    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>middle</cmp-a>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <!--o.0.1-->
        <div c-id="1.0.0.0">
          <!--s.1.1.1.0.-->
          <!--t.0.1-->
          middle
        </div>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });
    expect(clientHydrated.root['s-id']).toBe('1');

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          <div>
            <slot></slot>
          </div>
        </shadow-root>
        <!---->
        middle
      </cmp-a>
    `);
  });

  it('slot, text w/out vdom', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true
    })
    class CmpA {
      render() {
        return (
          <Host>
            top
            <slot></slot>
            bottom
          </Host>
        );
      }
    }

    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>middle</cmp-a>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <!--o.0.1-->
        <!--t.1.0.0.0-->
        top
        <!--s.1.1.0.1.-->
        <!--t.0.1-->
        middle
        <!--t.1.2.0.2-->
        bottom
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });
    expect(clientHydrated.root['s-id']).toBe('1');

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          top
          <slot></slot>
          bottom
        </shadow-root>
        <!---->
        middle
      </cmp-a>
    `);
  });

  it('no slot, child shadow text', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true
    })
    class CmpA {
      render() {
        return (
          <Host>
            shadow-text
          </Host>
        );
      }
    }

    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a></cmp-a>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <!--t.1.0.0.0-->
        shadow-text
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });
    expect(clientHydrated.root['s-id']).toBe('1');

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          shadow-text
        </shadow-root>
      </cmp-a>
    `);
  });

  it('named slot and slot depth 1', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true
    })
    class CmpA {
      render() {
        return (
          <Host>
            <div>
              <slot></slot>
            </div>
            <slot name='fixed'></slot>
          </Host>
        );
      }
    }

    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a></cmp-a>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <div c-id="1.0.0.0">
          <!--s.1.1.1.0.-->
        </div>
        <!--s.1.2.0.1.fixed-->
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true
    });
    expect(clientHydrated.root['s-id']).toBe('1');

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          <div>
            <slot></slot>
          </div>
          <slot name="fixed"></slot>
        </shadow-root>
      </cmp-a>
    `);
  });

  it('nested cmp-b, parent text light-dom slot', async () => {
    @Component({ tag: 'cmp-a', shadow: true })
    class CmpA {
      render() {
        return (
          <Host>
            <cmp-b>cmp-a-light-dom</cmp-b>
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
      <cmp-a s-id="1">
        <!--r.1-->
        <cmp-b c-id="1.0.0.0" s-id="2">
          <!--r.2-->
          <!--o.1.1-->
          <!--s.2.0.0.0.-->
          <!--t.1.1.1.0-->
          cmp-a-light-dom
        </cmp-b>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
      serializedShadowDom: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          <cmp-b>
            <!--r.2-->
            <!---->
            <!--s.2.0.0.0.-->
            cmp-a-light-dom
          </cmp-b>
        </shadow-root>
      </cmp-a>
    `);
  });

  it('nested text, complicated slots', async () => {
    @Component({ tag: 'cmp-a', shadow: true })
    class CmpA {
      render() {
        return (
          <Host>
            <section>
              <slot name='start'></slot>
              <slot name='secondary'></slot>
              <div>
                <slot></slot>
              </div>
              <slot name='primary'></slot>
              <slot name='end'></slot>
            </section>
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>
          Title
        </cmp-a>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a s-id="1">
        <!--r.1-->
        <!--o.0.1-->
        <section c-id="1.0.0.0">
          <!--s.1.1.1.0.start-->
          <!--s.1.2.1.1.secondary-->
          <div c-id="1.3.1.2">
            <!--s.1.4.2.0.-->
            <!--t.0.1-->
            Title
          </div>
          <!--s.1.5.1.3.primary-->
          <!--s.1.6.1.4.end-->
        </section>
      </cmp-a>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
      serializedShadowDom: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <cmp-a>
        <shadow-root>
          <section>
            <slot name="start"></slot>
            <slot name="secondary"></slot>
            <div>
              <slot></slot>
            </div>
            <slot name="primary"></slot>
            <slot name="end"></slot>
          </section>
        </shadow-root>
        <!---->
        Title
      </cmp-a>
    `);
  });

  it('root level component, nested shadow slot', async () => {
    @Component({ tag: 'ion-tab-button', shadow: true })
    class TabButton {
      render() {
        return (
          <Host>
            <a>
              <slot></slot>
              <ion-ripple-effect></ion-ripple-effect>
            </a>
          </Host>
        );
      }
    }
    @Component({ tag: 'ion-badge', shadow: true })
    class Badge {
      render() {
        return (
          <Host>
            <slot></slot>
          </Host>
        );
      }
    }
    @Component({ tag: 'ion-ripple-effect', shadow: true })
    class RippleEffect {
      render() {
        return (
          <Host></Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [Badge, RippleEffect, TabButton],
      html: `
        <ion-tab-button>
          <ion-badge>root-text</ion-badge>
        </ion-tab-button>
      `,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <ion-tab-button s-id="1">
        <!--r.1-->
        <!--o.0.2-->
        <a c-id="1.0.0.0">
          <!--s.1.1.1.0.-->
          <ion-badge c-id="0.2" s-id="2">
            <!--r.2-->
            <!--o.0.4-->
            <!--s.2.0.0.0.-->
            <!--t.0.4-->
            root-text
          </ion-badge>
          <ion-ripple-effect c-id="1.2.1.1" s-id="3">
            <!--r.3-->
          </ion-ripple-effect>
        </a>
      </ion-tab-button>
    `);

    // @ts-ignore
    const clientHydrated = await newSpecPage({
      components: [Badge, RippleEffect, TabButton],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
      serializedShadowDom: true
    });

    expect(clientHydrated.root).toEqualHtml(`
      <ion-tab-button>
        <shadow-root>
          <a>
            <slot></slot>
            <ion-ripple-effect>
              <shadow-root>
              </shadow-root>
            </ion-ripple-effect>
          </a>
        </shadow-root>
        <!---->
        <ion-badge>
          <shadow-root>
            <slot></slot>
          </shadow-root>
          <!---->
          root-text
        </ion-badge>
      </ion-tab-button>
    `);
  });

});
