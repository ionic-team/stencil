import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('hydrate, slot fallback', () => {
  it('light dom parent, renders slot fallback content', async () => {
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      render() {
        return (
          <article>
            <slot>
              Fallback text
              <strong>Fallback element</strong>
            </slot>
          </article>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <article c-id=\"1.0.0.0\">
        <!--t.1.2.2.0.1.-->
        Fallback text
        <strong c-id="1.3.2.1" s-sn="" sf-id="s.1.1.1.0..1.1">
          <!--t.1.4.3.0.0.-->
          Fallback element
        </strong>
        <!--Fallback text-->
        <!--s.1.1.1.0..1.1-->
      </article>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    expect(clientHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\">
      <!--r.1-->
      <article>
        <!--Fallback text-->
        Fallback text
        <strong>
          Fallback element
        </strong>
      </article>
    </cmp-a>`);
  });

  it('shadow dom parent, renders slot fallback content', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true,
    })
    class CmpA {
      render() {
        return (
          <article>
            <slot>
              Fallback text
              <strong>Fallback element</strong>
            </slot>
          </article>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <article c-id=\"1.0.0.0\">
        <!--t.1.2.2.0.1.-->
        Fallback text
        <strong c-id="1.3.2.1" s-sn="" sf-id="s.1.1.1.0..1.1">
          <!--t.1.4.3.0.0.-->
          Fallback element
        </strong>
        <!--Fallback text-->
        <!--s.1.1.1.0..1.1-->
      </article>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    expect(clientHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\">
      <mock:shadow-root>
        <article>
          <!--Fallback text-->
          <slot>
            Fallback text
            <strong>
              Fallback element
            </strong>
          </slot>
        </article>
      </mock:shadow-root>
    </cmp-a>`);
  });

  it('light dom parent, slotted light dom child renders slot fallback text', async () => {
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      render() {
        return (
          <article>
            <slot>Fallback content parent</slot>
            <p>Non slot based content</p>
          </article>
        );
      }
    }

    @Component({
      tag: 'cmp-b',
    })
    class CmpB {
      render() {
        return (
          <section>
            <slot>Fallback content child</slot>
            <p>Non slot based content</p>
          </section>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<cmp-a><cmp-b></cmp-b></cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1-->
      <article c-id=\"1.0.0.0\">
        <!--t.1.2.2.0.1.-->
        <!--Fallback content parent-->
        <!--s.1.1.1.0..1.1-->
        <cmp-b c-id=\"0.1\" class=\"hydrated\" s-id=\"2\" s-sn=\"\">
          <!--r.2-->
          <section c-id=\"2.0.0.0\">
            <!--t.2.2.2.0.1.-->
            Fallback content child
            <!--Fallback content child-->
            <!--s.2.1.1.0..1.1-->
            <p c-id=\"2.3.1.1\">
              <!--t.2.4.2.0.0.-->
              Non slot based content
            </p>
          </section>
        </cmp-b>
        <p c-id=\"1.3.1.1\">
          <!--t.1.4.2.0.0.-->
          Non slot based content
        </p>
      </article>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    expect(clientHydrated.root.outerHTML).toEqualHtml(`
    <cmp-a class=\"hydrated\">
      <!--r.1-->
      <article>
        <!--Fallback content parent-->
        <cmp-b class=\"hydrated\" class="hydrated">
          <!--r.2-->
          <section>
            <!--Fallback content child-->
            Fallback content child
            <p>
              Non slot based content
            </p>
          </section>
        </cmp-b>
        <p>
          Non slot based content
        </p>
      </article>
    </cmp-a>`);
  });



  it('shadow dom parent, slotted shadow dom child renders slot fallback text', async () => {
    @Component({
      tag: 'cmp-a',
      shadow: true,
    })
    class CmpA {
      render() {
        return (
          <article>
            <slot>Fallback content parent</slot>
            <p>Non slot based content</p>
          </article>
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
            <slot>Fallback content child</slot>
            <p>Non slot based content</p>
          </section>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: `<cmp-a><cmp-b></cmp-b></cmp-a>`,
      hydrateServerSide: true,
    });
    expect(serverHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\" s-id=\"1\">
      <!--r.1-->
      <!--o.0.1.-->
      <article c-id=\"1.0.0.0\">
        <!--t.1.2.2.0.1.-->
        <!--Fallback content parent-->
        <!--s.1.1.1.0..1.1-->
        <cmp-b c-id=\"0.1\" class=\"hydrated\" s-id=\"2\" s-sn=\"\">
          <!--r.2-->
          <section c-id=\"2.0.0.0\">
            <!--t.2.2.2.0.1.-->
            Fallback content child
            <!--Fallback content child-->
            <!--s.2.1.1.0..1.1-->
            <p c-id=\"2.3.1.1\">
              <!--t.2.4.2.0.0.-->
              Non slot based content
            </p>
          </section>
        </cmp-b>
        <p c-id=\"1.3.1.1\">
          <!--t.1.4.2.0.0.-->
          Non slot based content
        </p>
      </article>
    </cmp-a>`);

    const clientHydrated = await newSpecPage({
      components: [CmpA, CmpB],
      html: serverHydrated.root.outerHTML,
      hydrateClientSide: true,
    });

    expect(clientHydrated.root).toEqualHtml(`
    <cmp-a class=\"hydrated\">
      <mock:shadow-root>
        <article>
          <!--Fallback content parent-->
          <slot>
            Fallback content parent
          </slot>
          <p>
            Non slot based content
          </p>
        </article>
      </mock:shadow-root>
      <cmp-b class=\"hydrated\">
        <mock:shadow-root>
          <section>
            <!--Fallback content child-->
            <slot>
              Fallback content child
            </slot>
            <p>
              Non slot based content
            </p>
          </section>
        </mock:shadow-root>
      </cmp-b>
    </cmp-a>`);
  });
});
