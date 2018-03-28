import * as d from '../../declarations';
import { connectComponentOnReady } from '../../server/connect-element';
import { initComponentLoaded } from '../init-component-instance';
import { initCoreComponentOnReady } from '../component-on-ready';
import { mockDomApi, mockPlatform } from '../../testing/mocks';


describe('componentOnReady', () => {

  let plt: d.PlatformApi;
  let elm: d.HostElement;
  let instance: d.ComponentInstance;
  let App: d.AppGlobal;

  class TestInstance {
    componentDidLoad() {/**/}
  }

  beforeEach(() => {
    App = {};
  });


  describe('initCoreComponentOnReady', () => {

    it('should resolve if elm has loaded and is a known component', () => {
      const cmpRegistry: d.ComponentRegistry = {
        'ion-cmp': {}
      };
      plt = mockPlatform(null, null, cmpRegistry);
      elm = plt.domApi.$createElement('ion-cmp') as any;
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);
      plt.hasLoadedMap.set(elm, true);

      let resolvedElm = null;
      elm.componentOnReady(rElm => {
        resolvedElm = rElm;
      });
      expect(resolvedElm).toBe(elm);

      expect(plt.onReadyCallbacksMap.has(elm)).toBe(false);
    });

    it('should not resolve if elm hasnt loaded but is a known component', () => {
      const cmpRegistry: d.ComponentRegistry = {
        'ion-cmp': {}
      };
      plt = mockPlatform(null, null, cmpRegistry);
      elm = plt.domApi.$createElement('ion-cmp') as any;
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);

      let resolvedElm = null;
      elm.componentOnReady(rElm => {
        resolvedElm = rElm;
      });
      expect(resolvedElm).toBe(null);

      expect(plt.onReadyCallbacksMap.has(elm)).toBe(true);
    });

    it('should resolve immediately if elm isnt a known component', () => {
      plt = mockPlatform();
      elm = plt.domApi.$createElement('ion-cmp') as any;
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);

      let resolvedElm = null;
      elm.componentOnReady(rElm => {
        resolvedElm = rElm;
      });
      expect(resolvedElm).toBe(elm);
      expect(plt.onReadyCallbacksMap.has(elm)).toBe(false);
    });

  });


  describe('initComponentLoaded', () => {

    beforeEach(() => {
      App = {};
      plt = mockPlatform();
      elm = plt.domApi.$createElement('ion-cmp') as any;
      instance = new TestInstance();
      plt.instanceMap.set(elm, instance);
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);
    });

    it('should call multiple componentOnReady promises', async () => {
      let resolvedElm1 = null;
      let resolvedElm2 = null;

      const p1 = elm.componentOnReady().then(resolveElm => {
        resolvedElm1 = resolveElm;
      });

      const p2 = elm.componentOnReady().then(resolveElm => {
        resolvedElm2 = resolveElm;
      });

      initComponentLoaded(plt, elm, 'hydrated');

      await p1;
      await p2;

      expect(resolvedElm1).toBe(elm);
      expect(resolvedElm2).toBe(elm);
    });

    it('should call multiple componentOnReady callbacks', () => {
      let resolvedElm1 = null;
      let resolvedElm2 = null;

      elm.componentOnReady(resolveElm => {
        resolvedElm1 = resolveElm;
      });
      elm.componentOnReady(resolveElm => {
        resolvedElm2 = resolveElm;
      });

      initComponentLoaded(plt, elm, 'hydrated');
      expect(resolvedElm1).toBe(elm);
      expect(resolvedElm2).toBe(elm);
    });

  });

});
