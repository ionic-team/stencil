import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


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

  describe('globals/prototypes', () => {
    let page;
    beforeEach(async () => {
      @Component({ tag: 'cmp-el' })
      class CmpEl {
        // @ts-ignore
        private protoEl: any;
        private protoNodeList: any;

        constructor() {
          this.protoEl = Element.prototype;
          this.protoNodeList = NodeList.prototype;
        }
      }

      page = await newSpecPage({
        components: [CmpEl],
        html: `<cmp-el></cmp-el>`
      });
    });
    it('allows access to the NodeList prototype', async () => {
      expect(page.rootInstance.protoNodeList).toEqual(NodeList.prototype);
      expect(page.rootInstance.protoNodeList).toEqual((page.win as any).NodeList.prototype);
      expect(page.rootInstance.protoNodeList).toEqual((window as any).NodeList.prototype);
      expect(page.rootInstance.protoNodeList).toEqual((global as any).NodeList.prototype);
      expect(page.rootInstance.protoNodeList).toBeTruthy();
    });

    it('allows access to the Element prototype', async () => {
      expect(page.rootInstance.protoEl).toEqual(Element.prototype);
      expect(page.rootInstance.protoEl).toEqual((page.win as any).Element.prototype);
      expect(page.rootInstance.protoEl).toEqual((window as any).Element.prototype);
      expect(page.rootInstance.protoEl).toEqual((global as any).Element.prototype);
      expect(page.rootInstance.protoEl).toBeTruthy();
    });
  });
});
