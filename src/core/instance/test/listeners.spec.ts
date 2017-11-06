import { mockDomApi, mockPlatform, mockComponentInstance, mockDispatchEvent, mockWindow } from '../../../testing/mocks';
import { DomApi, HostElement } from '../../../util/interfaces';
import { createListenerCallback, replayQueuedEventsOnInstance, addListener, enableEventListener } from '../listeners';


describe('instance listeners', () => {

  describe('replayQueuedEventsOnInstance', () => {

    it('should fire off queued events on method', () => {
      elm._instance = {
        myMethod: function() {},
      };

      spyOn(elm._instance, 'myMethod');

      const onEvent = createListenerCallback(elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });

      replayQueuedEventsOnInstance(elm);

      expect(elm._instance.myMethod).toHaveBeenCalledWith({detail: {some: 'data'}});
      expect(elm._queuedEvents).toBeUndefined();
    });

    it('should do nothing if theres no queued events', () => {
      elm._instance = {
        myMethod: function() {}
      };
      spyOn(elm._instance, 'myMethod');
      replayQueuedEventsOnInstance(elm);
      expect(elm._queuedEvents).toBeUndefined();
    });

  });


  describe('createListenerCallback', () => {

    it('should fire instance methods when an instance is already on the element', () => {
      elm._instance = {
        myMethod: function() {}
      };
      spyOn(elm._instance, 'myMethod');

      const onEvent = createListenerCallback(elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });
      expect(elm._instance.myMethod).toHaveBeenCalledWith({detail: {some: 'data'}});
    });

    it('should fire instance methods multiple times', () => {
      elm._instance = {
        myMethod: function() {},
        myOtherMethod: function() {}
      };
      spyOn(elm._instance, 'myMethod');
      spyOn(elm._instance, 'myOtherMethod');

      const onEvent1 = createListenerCallback(elm, 'myMethod');
      onEvent1();

      const onEvent2 = createListenerCallback(elm, 'myOtherMethod');
      onEvent2();
      onEvent2();
      onEvent2();

      expect(elm._instance.myMethod).toHaveBeenCalledTimes(1);
      expect(elm._instance.myOtherMethod).toHaveBeenCalledTimes(3);
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

  describe('enableEventListener', () => {

    function newTestComponent(plt: any) {
      const instance = mockComponentInstance(plt, domApi, {
        listenersMeta: [{
          eventMethodName: 'test',
          eventName: 'myevent',
          eventCapture: true,
          eventPassive: true,
          eventDisabled: true
        }]
      });
      instance.test = function (ev: any) {
        expect(ev.detail).toEqual('hello');
      };
      spyOn(instance, 'test').and.callThrough();
      return instance;
    }

    it('should enable/disable the event', () => {
      const instance = newTestComponent(plt);

      enableEventListener(plt, instance, 'myevent', false);
      mockDispatchEvent(domApi, instance.__el, 'myevent');
      expect(instance.test).not.toBeCalled();

      enableEventListener(plt, instance, 'myevent', true);
      mockDispatchEvent(domApi, instance.__el, 'myevent', 'hello');
      expect(instance.test).toBeCalled();

      enableEventListener(plt, instance, 'myevent', false);
      mockDispatchEvent(domApi, instance.__el, 'myevent');
      expect(instance.test).toHaveBeenCalledTimes(1);
    });

    it('should listen to body', () => {
      const instance = newTestComponent(plt);
      testAttachTo('body', instance, doc.body);
    });

    it('should listen to document', () => {
      const instance = newTestComponent(plt);
      testAttachTo('document', instance, doc);
    });

    it('should listen to window', () => {
      const instance = newTestComponent(plt);
      testAttachTo('window', instance, win);
    });

    it('should listen to parent', () => {
      const instance = newTestComponent(plt);
      const parent = domApi.$createElement('div');
      parent.appendChild(instance.__el);
      testAttachTo('parent', instance, parent);
    });

    it('should listen to child', () => {
      const instance = newTestComponent(plt);
      const child = domApi.$createElement('div');
      instance.__el.appendChild(child);
      testAttachTo('child', instance, child);
    });

    it('should listen to custom', () => {
      const instance = newTestComponent(plt);
      const custom = domApi.$createElement('div');
      testAttachTo(custom, instance, custom);
    });

    function testAttachTo(attachTo: any, instance: any, el: any) {
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).not.toHaveBeenCalled();

      enableEventListener(plt, instance, 'myevent', false, attachTo);
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).not.toHaveBeenCalled();

      enableEventListener(plt, instance, 'myevent', true, attachTo);
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(2);

      enableEventListener(plt, instance, 'myevent', false);
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(2);

      enableEventListener(plt, instance, 'myevent', true, attachTo);
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(3);

      enableEventListener(plt, instance, 'myevent', false, attachTo);
      mockDispatchEvent(domApi, el, 'myevent', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(3);
    }
  });


  describe('addListener', () => {
    it('should register simple event', () => {
      testAddEventListener(
        elm, 'myevent', false, false,
        elm, 'myevent', false);
    });

    it('should register event with attachTo', () => {
      testAddEventListener(
        elm, 'body:myevent', true, true,
        elm.ownerDocument.body, 'myevent', false);
    });

    it('should register event with modifier', () => {
      testAddEventListener(
        elm, 'myevent.enter', false, true,
        elm, 'myevent', 13);
    });

    it('should register event with modifier and attachTo', () => {
      testAddEventListener(
        elm, 'body:myevent.enter', false, true,
        elm.ownerDocument.body, 'myevent', 13);
    });

    function testAddEventListener(el: any, eventName: string, capture: boolean, passive: boolean,
      target: any, targetName: string, keyCode: any) {
      let calledCallback = false;
      let calledAdd = false;
      let calledRm = false;
      let internalCallback: Function;

      const f = () => {
        calledCallback = true;
      };

      target.addEventListener = function (name: any, callback: any, options: any) {
        calledAdd = true;
        internalCallback = callback;
        expect(name).toEqual(targetName);
        expect(options.passive).toEqual(passive);
        // expect(options.capture).toEqual(capture);
      };

      target.removeEventListener = function (name: any, callback: any, options: any) {
        calledRm = true;
        expect(callback).toEqual(internalCallback);
        expect(name).toEqual(targetName);
        expect(options.passive).toEqual(passive);
        expect(options.capture).toEqual(capture);
      };

      const rm = addListener(plt, el, eventName, f, capture, passive);
      expect(calledAdd).toBeTruthy();
      expect(calledRm).toBeFalsy();
      if (keyCode !== false) {
        internalCallback({keyCode: keyCode + 1});
        expect(calledCallback).toBeFalsy();
      }

      internalCallback({keyCode: keyCode});
      expect(calledCallback).toBeTruthy();

      rm();
      expect(calledRm).toBeTruthy();
    }
  });

  let domApi: DomApi;
  let elm: HostElement;
  let plt: any;
  let win: any;
  let doc: any;

  beforeEach(() => {
    win = mockWindow();
    doc = win.document;
    domApi = mockDomApi(win, doc);
    domApi.$supportsEventOptions = true;
    plt = mockPlatform(win, domApi);
    elm = domApi.$createElement('ion-cmp') as any;
  });

});
