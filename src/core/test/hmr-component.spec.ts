import * as d from '../../declarations';
import { hmrFinished, hmrStart } from '../hmr-component';
import { mockElement, mockPlatform } from '../../testing/mocks';
import { noop } from '../../util/helpers';


describe('hmr-component', () => {
  let cmpMeta: d.ComponentMeta;
  let elm: d.HostElement;
  let plt: d.PlatformApi;

  beforeEach(() => {
    plt = mockPlatform();
    plt.requestBundle = noop;
    cmpMeta = {};
    elm = mockElement();
    plt.getComponentMeta = () => cmpMeta;
  });


  describe('hmrFinished', () => {

    it('should add listeners from constructor', () => {
      const listeners: d.ComponentConstructorListener[] = [
        {
          method: 'method',
          name: 'name',
          capture: true,
          passive: false,
          disabled: true
        }
      ];

      cmpMeta.componentConstructor = {
        listeners
      } as any;

      hmrFinished(plt, cmpMeta, elm);
      expect(plt.hasListenersMap.has(elm)).toBe(true);
      expect(cmpMeta.listenersMeta).toHaveLength(1);
      expect(cmpMeta.listenersMeta[0].eventMethodName).toBe('method');
      expect(cmpMeta.listenersMeta[0].eventName).toBe('name');
      expect(cmpMeta.listenersMeta[0].eventCapture).toBe(true);
      expect(cmpMeta.listenersMeta[0].eventPassive).toBe(false);
      expect(cmpMeta.listenersMeta[0].eventDisabled).toBe(true);
    });

  });


  describe('hmrStart', () => {

    it('should add s-hmr-load callback', () => {
      hmrStart(plt, cmpMeta, elm, '1234');
      expect(typeof elm['s-hmr-load']).toBe('function');
    });

    it('should remove old event listeners', () => {
      cmpMeta.listenersMeta = [];
      plt.hasListenersMap.set(elm, true);
      hmrStart(plt, cmpMeta, elm, '1234');
      expect(plt.hasListenersMap.has(elm)).toBe(false);
      expect(cmpMeta.listenersMeta).toBe(null);
    });

    it('should remove old instance', () => {
      const instance = {};
      plt.instanceMap.set(elm, instance);
      plt.hostElementMap.set(instance, elm);
      hmrStart(plt, cmpMeta, elm, '1234');
      expect(plt.instanceMap.has(elm)).toBe(false);
      expect(plt.hostElementMap.has(instance)).toBe(false);
    });

    it('should remove old constructor', () => {
      cmpMeta.componentConstructor = class {} as any;
      hmrStart(plt, cmpMeta, elm, '1234');
      expect(cmpMeta.componentConstructor).toBe(null);
    });

  });

});
