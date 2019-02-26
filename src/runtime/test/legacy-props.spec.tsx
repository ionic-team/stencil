import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('legacy props', () => {

  it('load context and connect', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop({ connect: 'ion-menu-controller' }) menuController: any;
      @Prop({ context: 'isServer' }) isServer: boolean;
      render() {
        return `${this.isServer}-${typeof this.menuController}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>true-object</cmp-a>
    `);
  });

});
