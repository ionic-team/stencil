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

      let called = false;
      elm.componentOnReady(() => {
        called = true;
      });
      expect(called).toBe(true);

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

      let called = false;
      elm.componentOnReady(() => {
        called = true;
      });
      expect(called).toBe(false);

      expect(plt.onReadyCallbacksMap.has(elm)).toBe(true);
    });

    it('should resolve immediately if elm isnt a known component', () => {
      plt = mockPlatform();
      elm = plt.domApi.$createElement('ion-cmp') as any;
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);

      let called = false;
      elm.componentOnReady(() => {
        called = true;
      });
      expect(called).toBe(true);
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
      let called1 = false;
      let called2 = false;

      const p1 = elm.componentOnReady().then(() => {
        called1 = true;
      });

      const p2 = elm.componentOnReady().then(() => {
        called2 = true;
      });

      initComponentLoaded(plt, elm, 'hydrated');

      await p1;
      await p2;

      expect(called1).toBe(true);
      expect(called2).toBe(true);
    });

    it('should call multiple componentOnReady callbacks', () => {
      let called1 = false;
      let called2 = false;

      elm.componentOnReady(() => {
        called1 = true;
      });
      elm.componentOnReady(() => {
        called2 = true;
      });

      initComponentLoaded(plt, elm, 'hydrated');
      expect(called1).toBe(true);
      expect(called2).toBe(true);
    });

  });

});
