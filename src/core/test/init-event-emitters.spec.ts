import { initEventEmitters } from '../init-event-emitters';
import { mockDocument, mockPlatform } from '../../testing/mocks';


describe('initEventEmitters', () => {

  it('should init event emitter', () => {
    const plt = mockPlatform();
    const instance = {};
    const elm = plt.domApi.$createElement('div');

    plt.instanceMap.set(elm, instance);
    plt.hostElementMap.set(instance, elm);

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

    for (const event of events) {
      instance[event.method].emit('detail');
      expect(plt.emitEvent).toBeCalledWith(elm, event.name, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        composed: event.composed,
        detail: 'detail'
      });
    }
  });

});
