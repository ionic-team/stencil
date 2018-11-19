import { createListenerCallback, enableEventListener, initElementListeners } from '../listeners';
import { DomApi, HostElement, PlatformApi } from '../../declarations';
import { initComponentInstance } from '../init-component-instance';
import { mockComponentInstance, mockDispatchEvent, mockPlatform, mockWindow, testingPerf } from '../../testing/mocks';


describe('instance listeners', () => {

  let domApi: DomApi;
  let elm: HostElement;
  let plt: PlatformApi;
  let win: any;
  let doc: any;

  beforeEach(() => {
    win = mockWindow();
    doc = win.document;
    plt = mockPlatform(win);
    domApi = plt.domApi;
    domApi.$supportsEventOptions = true;
    elm = domApi.$createElement('ion-cmp') as any;
  });

  it('should only add enabled listeners', () => {
    const instance = mockComponentInstance(plt, domApi, {
      listenersMeta: [{
        eventMethodName: 'test',
        eventName: 'disabled1',
        eventDisabled: true
      },
      {
        eventMethodName: 'test2',
        eventName: 'disabled2',
        eventDisabled: true
      },
      {
        eventMethodName: 'test3',
        eventName: 'enabled',
        eventCapture: true,
        eventDisabled: false
      }]
    });

    spyOn(elm, 'addEventListener');
    initElementListeners(plt, elm);
    expect(elm.addEventListener).toHaveBeenCalledTimes(1);
    expect(elm.addEventListener).toBeCalledWith('enabled', expect.any(Function), {
      capture: true,
      passive: false
    });
  });

  describe('queue and reply events on instance', () => {

    it('should fire off queued events on method', () => {

      plt.defineComponent({
        tagNameMeta: 'ion-cmp',
        componentConstructor: class {
          data: any;

          myMethod(data: any) {
            this.data = data;
          }

          getData() {
            return this.data;
          }
        } as any
      });

      const onEvent = createListenerCallback(plt, elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });

      expect(plt.queuedEvents.get(elm)).toHaveLength(2);

      const instance = initComponentInstance(plt, elm, {}, testingPerf);

      const data = instance.getData();
      expect(data).toEqual({ detail: { some: 'data' } });
      expect(plt.queuedEvents.has(elm)).toBeFalsy();
    });

    it('should queue up events if theres no instance on the element', () => {
      const onEvent = createListenerCallback(plt, elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });
      onEvent({
        detail: { some: 'more data' }
      });
      expect(plt.queuedEvents.get(elm)).toHaveLength(4);
    });

  });


  describe('createListenerCallback', () => {

    it('should fire instance methods when an instance is already on the element', () => {
      const instance = {
        myMethod: function() {/**/}
      };
      spyOn(instance, 'myMethod');
      plt.instanceMap.set(elm, instance);

      const onEvent = createListenerCallback(plt, elm, 'myMethod');
      onEvent({
        detail: { some: 'data' }
      });
      expect(instance.myMethod).toHaveBeenCalledWith({detail: {some: 'data'}});
    });

    it('should fire instance methods multiple times', () => {
      const instance = {
        myMethod: function() {/**/},
        myOtherMethod: function() {/**/}
      };
      spyOn(instance, 'myMethod');
      spyOn(instance, 'myOtherMethod');

      plt.instanceMap.set(elm, instance);

      const onEvent1 = createListenerCallback(plt, elm, 'myMethod');
      onEvent1();

      const onEvent2 = createListenerCallback(plt, elm, 'myOtherMethod');
      onEvent2();
      onEvent2();
      onEvent2();

      expect(instance.myMethod).toHaveBeenCalledTimes(1);
      expect(instance.myOtherMethod).toHaveBeenCalledTimes(3);
    });

  });

  describe('enableEventListener', () => {

    it('should enable/disable a disabled event', () => {
      testEnableDisableEvent('d_passive');
    });

    it('should enable/disable an enabled event', () => {
      testEnableDisableEvent('e_passive');
    });

    function testEnableDisableEvent(eventName: string) {
      const instance = newTestComponent();
      const elm = plt.hostElementMap.get(instance);
      const cmpMeta = plt.getComponentMeta(elm);
      spyOn(elm, 'addEventListener').and.callThrough();
      spyOn(elm, 'removeEventListener').and.callThrough();

      // Remove listener (it was never added, should do nothing)
      enableEventListener(plt, instance, eventName, false);
      mockDispatchEvent(elm, eventName);
      expect(instance.test).not.toBeCalled();
      expect(elm.addEventListener).toHaveBeenCalledTimes(0);
      expect(elm.removeEventListener).toHaveBeenCalledTimes(0);

      // Add listener
      enableEventListener(plt, instance, eventName, true);
      mockDispatchEvent(elm, eventName, 'hello');
      expect(instance.test).toBeCalled();
      expect(elm.addEventListener).toHaveBeenCalledTimes(1);
      expect(elm.removeEventListener).toHaveBeenCalledTimes(0);

      // Add listener, second time, should do nothing
      enableEventListener(plt, instance, eventName, true);
      expect(elm.addEventListener).toHaveBeenCalledTimes(2);
      expect(elm.removeEventListener).toHaveBeenCalledTimes(1);

      // Remove listener
      enableEventListener(plt, instance, eventName, false);
      mockDispatchEvent(elm, eventName);
      expect(instance.test).toHaveBeenCalledTimes(1);
      expect(elm.addEventListener).toHaveBeenCalledTimes(2);
      expect(elm.removeEventListener).toHaveBeenCalledTimes(2);
    }

    it('should not listen for unregistered events', () => {
      const instance = newTestComponent();
      const elm = plt.hostElementMap.get(instance);
      spyOn(elm, 'addEventListener').and.callThrough();
      spyOn(elm, 'removeEventListener').and.callThrough();

      enableEventListener(plt, instance, 'unknown_event', true);
      enableEventListener(plt, instance, 'unknown_event', false);

      expect(elm.addEventListener).not.toBeCalled();
      expect(elm.removeEventListener).not.toBeCalled();
    });

    it('should listen to body', () => {
      const instance = newTestComponent();
      testAttachTo('body', instance, doc.body);
    });

    it('should listen to document', () => {
      const instance = newTestComponent();
      testAttachTo('document', instance, doc);
    });

    it('should listen to window', () => {
      const instance = newTestComponent();
      testAttachTo('window', instance, win);
    });

    it('should listen to parent', () => {
      const instance = newTestComponent();
      const parent = domApi.$createElement('div');
      const elm = plt.hostElementMap.get(instance);
      parent.appendChild(elm);
      testAttachTo('parent', instance, parent);
    });

    it('should listen to child', () => {
      const instance = newTestComponent();
      const child = domApi.$createElement('div');
      const elm = plt.hostElementMap.get(instance);
      elm.appendChild(child);
      testAttachTo('child', instance, child);
    });

    it('should listen to custom', () => {
      const instance = newTestComponent();
      const custom = domApi.$createElement('div');
      testAttachTo(custom, instance, custom);
    });

    function testAttachTo(attachTo: any, instance: any, el: any) {
      domApi.$supportsEventOptions = true;

      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).not.toHaveBeenCalled();

      enableEventListener(plt, instance, 'd_passive', false, attachTo);
      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).not.toHaveBeenCalled();

      enableEventListener(plt, instance, 'd_passive', true, attachTo);
      mockDispatchEvent(el, 'd_passive', 'hello');
      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(2);

      enableEventListener(plt, instance, 'd_passive', false);
      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(2);

      enableEventListener(plt, instance, 'd_passive', true, attachTo);
      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(3);

      enableEventListener(plt, instance, 'd_passive', false, attachTo);
      mockDispatchEvent(el, 'd_passive', 'hello');
      expect(instance.test).toHaveBeenCalledTimes(3);
    }

    it('should pass the events options properly', () => {
      testEventsOptions('d_passive', undefined, true, true);
      testEventsOptions('d_non_passive', undefined, false, false);

      testEventsOptions('d_passive', true, true, true);
      testEventsOptions('d_non_passive', true, true, false);

      testEventsOptions('d_passive', false, false, true);
      testEventsOptions('d_non_passive', false, false, false);
    });

    function testEventsOptions(eventName, passive, expectedPassive, expectedCapture) {
      domApi.$supportsEventOptions = true;
      const instance = newTestComponent();
      const elm = plt.hostElementMap.get(instance);
      spyOn(elm, 'addEventListener');

      enableEventListener(plt, instance, eventName, true, undefined, passive);

      expect(elm.addEventListener).toBeCalledWith(eventName, expect.any(Function), {
        passive: expectedPassive,
        capture: expectedCapture
      });
    }

    function newTestComponent() {
      domApi.$supportsEventOptions = true;
      const instance = mockComponentInstance(plt, domApi, {
        listenersMeta: [{
          eventMethodName: 'test',
          eventName: 'd_passive',
          eventCapture: true,
          eventPassive: true,
          eventDisabled: true
        },
        {
          eventMethodName: 'test',
          eventName: 'd_non_passive',
          eventCapture: false,
          eventPassive: false,
          eventDisabled: true
        },
        {
          eventMethodName: 'test',
          eventName: 'e_passive',
          eventCapture: false,
          eventPassive: true,
          eventDisabled: false
        }]
      });
      instance.test = (ev: any) => {
        expect(ev.detail).toEqual('hello');
      };
      spyOn(instance, 'test').and.callThrough();
      return instance;
    }
  });


  describe('domApi.$addEventListener', () => {
    it('should register simple event', () => {
      testAddEventListener(
        elm, 'd_passive', false, false,
        elm, 'd_passive', false);
    });

    it('should register event with attachTo', () => {
      testAddEventListener(
        elm, 'body:d_passive', true, true,
        elm.ownerDocument.body, 'd_passive', false);
    });

    it('should register event with modifier', () => {
      testAddEventListener(
        elm, 'd_passive.enter', false, true,
        elm, 'd_passive', 13);
    });

    it('should register event with modifier and attachTo', () => {
      testAddEventListener(
        elm, 'body:d_passive.enter', false, true,
        elm.ownerDocument.body, 'd_passive', 13);
    });

    function testAddEventListener(el: any, eventName: string, capture: boolean, passive: boolean,
      target: any, targetName: string, keyCode: any) {
      let calledCallback = false;
      let internalCallback: Function;

      target.addEventListener = (_name: any, callback: any) => {
        internalCallback = callback;
      };

      spyOn(target, 'addEventListener').and.callThrough();
      spyOn(target, 'removeEventListener').and.callThrough();

      const f = () => {
        calledCallback = true;
      };

      // test if target-addEventListener is called properly
      domApi.$addEventListener(el, eventName, f, capture, passive);
      expect(target.addEventListener).toHaveBeenCalledWith(targetName, internalCallback, {
        passive: passive,
        capture: capture
      });

      // test key based events are dispatched properly
      if (keyCode !== false) {
        internalCallback({keyCode: keyCode + 1});
        expect(calledCallback).toBeFalsy();
      }

      internalCallback({keyCode: keyCode});
      expect(calledCallback).toBeTruthy();

      // test if the listener is removed
      domApi.$removeEventListener(el, eventName);
      expect(target.removeEventListener).toHaveBeenCalledWith(targetName, internalCallback, {
        passive: passive,
        capture: capture
      });
    }
  });


});
