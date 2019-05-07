import { newSpecPage } from '@stencil/core/testing';
import { Component, Method, Prop } from '@stencil/core';


describe('connect', () => {

  it('should return proxy', async () => {
    @Component({
      tag: 'cmp-controller',
    })
    class CmpController {
      @Method()
      create(opts: any) {
        return opts;
      }
    }

    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      @Prop({connect: 'cmp-controller'}) controller: any;

      @Method()
      open(opts: any) {
        return this.controller.create(opts);
      }
    }

    const {root, waitForChanges} = await newSpecPage({
      components: [CmpController, CmpA],
      html: `<cmp-a></cmp-a>`
    });

    const promise = root.open(123);

    await waitForChanges();
    await waitForChanges();

    expect(await promise).toEqual(123);
  });
});
