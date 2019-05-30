import { Component, Prop, QueueApi, Method } from '@stencil/core';

@Component({
  tag: 'legacy-context'
})
export class LegacyContextRoot {

  @Prop({context: 'window'}) win!: Window;
  @Prop({context: 'document'}) doc!: Document;
  @Prop({context: 'queue'}) queue!: QueueApi;
  @Prop({context: 'isServer'}) isServer!: boolean;
  @Prop({context: 'resourcesUrl'}) resourcesUrl!: string;
  @Prop({context: 'unknown'}) unknown: any;
  @Prop({context: 'myService'}) myService: any;

  @Method()
  async getData() {
    return {
      win: this.win,
      doc: this.doc,
      hasQueue: !!this.queue,
      isServer: this.isServer,
      unknown: this.unknown,
      myService: this.myService
    }
  }
}
