import { initEventEmitters } from '../init-event-emitters';
import { mockPlatform, mockComponentInstance, mockElement } from '../../../testing/mocks';
import { HostElement } from '../../../index';
import { ComponentConstructorEvent } from '../../../util/interfaces';

describe('initEventEmitters', () => {
  it('should init event emitter', () => {
    const plt = mockPlatform();
    const instance = {__el: mockElement() as any};
    const events = [{
      name: 'my-event',
      method: 'myEvent',
      bubbles: true,
      cancelable: true,
      composed: true
    },
    {
      name: 'ionEvent',
      method: 'ionEvent',
      bubbles: false,
      cancelable: false,
      composed: false
    }];

    spyOn(plt, 'emitEvent').and.callThrough();
    initEventEmitters(plt, events, instance);

    for (let event of events) {
      instance[event.method].emit('detail');
      expect(plt.emitEvent).toBeCalledWith(instance.__el, event.name, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        composed: event.composed,
        detail: 'detail'
      });
    }
  });
});
