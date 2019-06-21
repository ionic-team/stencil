import { newSpecPage } from '@stencil/core/testing';
import { Component, Method, Prop, readTask, writeTask } from '@stencil/core';


describe('queue', () => {

  it('should execute tasks in the right order', async () => {
    let log = '';
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      @Method()
      doQueue() {
        writeTask(() => log += ' write1');
        readTask(() => log += ' read1');
        readTask(() => log += ' read2');
        writeTask(() => log += ' write2');
        readTask(() => log += ' read3');
      }
    }
    const {root, waitForChanges} = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`
    });

    await root.doQueue();
    expect(log).toEqual('');

    await waitForChanges();

    expect(log).toEqual(' read1 read2 read3 write1 write2');
  });

  it('should replace default values of context', async () => {
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      @Prop({ context: 'resourcesUrl' }) resourcesUrl: boolean;
    }
    const {rootInstance} = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      context: {
        resourcesUrl: '/blabla'
      }
    });
    expect(rootInstance.resourcesUrl).toEqual('/blabla');
  });

  it('should extend context', async () => {
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      @Prop({ context: 'value' }) value: number;
      @Prop({ context: 'unknown' }) unknown: any;
    }
    const {rootInstance} = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      context: {
        value: 1234
      }
    });
    expect(rootInstance.value).toEqual(1234);
    expect(rootInstance.unknown).toEqual(undefined);
  });

});
