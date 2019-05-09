import { newSpecPage } from '@stencil/core/testing';
import { Component, Prop, writeTask, readTask } from '@stencil/core';
import { QueueApi } from '../../declarations';


describe('context', () => {

  it('should return default values of context', async () => {
    @Component({
      tag: 'cmp-a',
    })
    class CmpA {
      @Prop({ context: 'window' }) win: Window;
      @Prop({ context: 'document' }) doc: Document;
      @Prop({ context: 'isServer' }) isServer: boolean;
      @Prop({ context: 'resourcesUrl' }) resourcesUrl: string;
      @Prop({ context: 'queue' }) queue: QueueApi;
    }
    const {win, doc, rootInstance} = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`
    });

    expect(rootInstance.win).toEqual(win);
    expect(rootInstance.doc).toEqual(doc);
    expect(rootInstance.resourcesUrl).toEqual('/');
    expect(rootInstance.queue.write).toEqual(writeTask);
    expect(rootInstance.queue.read).toEqual(readTask);
    expect(rootInstance.queue.tick).not.toBeUndefined();
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
