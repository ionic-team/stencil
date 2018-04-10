import { Component, Event, EventEmitter, Method } from '../../../dist/index';

@Component({
  tag: 'event-cmp'
})
export class EventCmp {

  @Event() myEvent: EventEmitter<boolean>;

  @Event({
    eventName: 'my-event-with-options',
    bubbles: false,
    cancelable: false
  }) myEventWithOptions: EventEmitter<{ mph: number }>;

  @Method()
  emitEvent() {
    this.myEvent.emit(true);
  }

  @Method()
  fireEventWithOptions() {
    this.myEventWithOptions.emit({ mph: 88 });
  }

}
