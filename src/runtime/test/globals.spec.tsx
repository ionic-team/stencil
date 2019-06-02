import { Component } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";


describe('globals', () => {

  @Component({
    tag: 'cmp-a'
  })
  class CmpA {}

  it('should mock json fetch, no input', async () => {
    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      autoApplyChanges: true
    });
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        page.win.requestAnimationFrame(() => {
          setTimeout(() => {
            page.win.setTimeout(() => {
              resolve();
            }, 10);
          }, 10);
        });
      });
    });
  });

  it('allows access to the Element prototype', async () => {
    @Component({ tag: 'cmp-el' })
    class CmpEl {
      // @ts-ignore
      private proto: any;

      constructor() {
        this.proto = Element.prototype;
      }
    }

    const page = await newSpecPage({
      components: [CmpEl],
      html: `<cmp-el></cmp-el>`
    });

    expect(page.root).toEqualHtml(`
      <cmp-el></cmp-el>
    `);
  });
});
