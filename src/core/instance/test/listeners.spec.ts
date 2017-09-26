import { mockDomApi } from '../../../testing/mocks';
import { HostElement } from '../../../util/interfaces';
import { createListenerCallback, replayQueuedEventsOnInstance } from '../listeners';


describe('instance listeners', () => {

  describe('replayQueuedEventsOnInstance', () => {

    it('should fire off queued events on method', () => {
      elm.$instance = {
        myMethod: function() {},
      };

      spyOn(elm.$instance, 'myMethod');

      const onEvent = createListenerCallback(elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });

      replayQueuedEventsOnInstance(elm);

      expect(elm.$instance.myMethod).toHaveBeenCalledWith({detail: {some: 'data'}});
      expect(elm._queuedEvents).toBeUndefined();
    });

    it('should do nothing if theres no queued events', () => {
      elm.$instance = {
        myMethod: function() {}
      };
      spyOn(elm.$instance, 'myMethod');
      replayQueuedEventsOnInstance(elm);
      expect(elm._queuedEvents).toBeUndefined();
    });

  });


  describe('createListenerCallback', () => {

    it('should fire instance methods when an instance is already on the element', () => {
      elm.$instance = {
        myMethod: function() {}
      };
      spyOn(elm.$instance, 'myMethod');

      const onEvent = createListenerCallback(elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });
      expect(elm.$instance.myMethod).toHaveBeenCalledWith({detail: {some: 'data'}});
    });

    it('should fire instance methods multiple times', () => {
      elm.$instance = {
        myMethod: function() {},
        myOtherMethod: function() {}
      };
      spyOn(elm.$instance, 'myMethod');
      spyOn(elm.$instance, 'myOtherMethod');

      const onEvent1 = createListenerCallback(elm, 'myMethod');
      onEvent1();

      const onEvent2 = createListenerCallback(elm, 'myOtherMethod');
      onEvent2();
      onEvent2();
      onEvent2();

      expect(elm.$instance.myMethod).toHaveBeenCalledTimes(1);
      expect(elm.$instance.myOtherMethod).toHaveBeenCalledTimes(3);
    });

    it('should queue up events if theres no instance on the element', () => {
      const onEvent = createListenerCallback(elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });
      onEvent({
        detail: { some: 'more data' }
      });
      expect(elm._queuedEvents.length).toBe(4);
    });

  });


  const domApi = mockDomApi();
  let elm: HostElement;

  beforeEach(() => {
    elm = domApi.$createElement('ion-cmp') as any;
  });

});
