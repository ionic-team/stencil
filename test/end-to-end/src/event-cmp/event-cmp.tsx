import { Component, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'event-cmp',
})
export class EventCmp {
  @Event() myDocumentEvent: EventEmitter<any>;

  @Event({
    eventName: 'my-event-with-options',
    bubbles: false,
    cancelable: false,
  })
  myEventWithOptions: EventEmitter<{ mph: number }>;

  @Event() myWindowEvent: EventEmitter<number>;

  @Method()
  async methodThatFiresMyWindowEvent(value: number) {
    this.myWindowEvent.emit(value);
  }

  @Method()
  async methodThatFiresMyDocumentEvent() {
    this.myDocumentEvent.emit();
  }

  @Method()
  async methodThatFiresEventWithOptions() {
    this.myEventWithOptions.emit({ mph: 88 });
  }
}
