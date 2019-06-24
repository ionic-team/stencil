import { Component } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";


describe('globals', () => {

  @Component({
    tag: 'cmp-a'
  })
  class CmpA {}

  it('should resolve raf and setTimeout', async () => {
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

  it('allows access to window.JSON', async () => {
    expect(JSON.stringify([0])).toEqual('[0]');
    expect((window as any).JSON.stringify([0])).toEqual('[0]');
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

    expect(page.rootInstance.proto).toEqual(Element.prototype);
    expect(page.rootInstance.proto).toEqual((page.win as any).Element.prototype);
    expect(page.rootInstance.proto).toEqual((window as any).Element.prototype);
    expect(page.rootInstance.proto).toEqual((global as any).Element.prototype);
    expect(page.rootInstance.proto).toBeTruthy();
  });
});
