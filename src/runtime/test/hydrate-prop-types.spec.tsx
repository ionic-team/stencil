import { Component, Host, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('hydrate prop types', () => {

  it('number', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Prop() num: number;

      render() {
        this.num += 100;

        return (
          <Host>
            {this.num}
          </Host>
        );
      }
    }
    // @ts-ignore
    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a num="1"></cmp-a>`,
      hydrateServerSide: true
    });
    expect(serverHydrated.root).toEqualHtml(`
      <cmp-a num="1" s-id="1">
        <!--r.1-->
        <!--t.1.0.0.0-->
        101
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
      <cmp-a num="1">
        <!--r.1-->
        101
      </cmp-a>
    `);
  });

});
