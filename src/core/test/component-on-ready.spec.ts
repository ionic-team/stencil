import * as d from '../../declarations';
import { connectComponentOnReady } from '../../server/connect-element';
import { createComponentOnReadyPrototype } from '../../client/loader';
import { initComponentLoaded } from '../init-component-instance';
import { initCoreComponentOnReady } from '../component-on-ready';
import { mockDomApi, mockPlatform, mockWindow } from '../../testing/mocks';


describe('componentOnReady', () => {

  let win: d.WindowData;
  let plt: d.PlatformApi;
  let elm: d.HostElement;
  let instance: d.ComponentInstance;
  let App: d.AppGlobal;

  class TestInstance {
    componentDidLoad() {/**/}
  }

  beforeEach(() => {
    win = mockWindow();
    App = {};
    win['MyApp'] = App;
  });


  describe('initCoreComponentOnReady', () => {

    it('should resolve if elm has loaded and is a known component', async () => {
      const cmpRegistry: d.ComponentRegistry = {
        'ion-cmp': {}
      };
      plt = mockPlatform(win, null, cmpRegistry);

      class MyElement {
        nodeName = 'ion-cmp';
        componentOnReady: Function;
      }

      createComponentOnReadyPrototype(win, 'MyApp', MyElement.prototype);
      initCoreComponentOnReady(plt, App);

      const elm = new MyElement();
      plt.isCmpReady.set(elm as any, true);
      plt.isCmpLoaded.set(elm as any, true);

      const resolvedElm = await elm.componentOnReady();
      expect(resolvedElm).toBe(elm);

      expect(plt.onReadyCallbacksMap.has(elm as any)).toBe(false);
    });

    it('should not resolve if elm hasnt loaded but is a known component', () => {
      const cmpRegistry: d.ComponentRegistry = {
        'ion-cmp': {}
      };
      plt = mockPlatform(null, null, cmpRegistry);

      class MyElement {
        nodeName = 'ion-cmp';
        componentOnReady: Function;
      }

      createComponentOnReadyPrototype(win, 'MyApp', MyElement.prototype);
      initCoreComponentOnReady(plt, App);

      const elm = new MyElement();
      elm.componentOnReady().then(_ => {
        /**/
      });

      expect(plt.onReadyCallbacksMap.has(elm as any)).toBe(true);
    });

    it('should not resolve if elm has loaded, but isnt ready, and is a known component', () => {
      const cmpRegistry: d.ComponentRegistry = {
        'ion-cmp': {}
      };
      plt = mockPlatform(null, null, cmpRegistry);

      class MyElement {
        nodeName = 'ion-cmp';
        componentOnReady: Function;
      }

      createComponentOnReadyPrototype(win, 'MyApp', MyElement.prototype);
      initCoreComponentOnReady(plt, App);

      const elm = new MyElement();
      plt.isCmpReady.delete(elm as any);
      plt.isCmpLoaded.set(elm as any, true);

      elm.componentOnReady().then(_ => {
        /**/
      });

      expect(plt.onReadyCallbacksMap.has(elm as any)).toBe(true);
    });

    it('should resolve immediately if elm isnt a known component', async () => {
      plt = mockPlatform();
      elm = plt.domApi.$createElement('div') as any;
      initCoreComponentOnReady(plt, App);
      connectComponentOnReady(App, elm);

      const resolvedElm = await elm.componentOnReady();
      expect(resolvedElm).toBe(null);
      expect(plt.onReadyCallbacksMap.has(elm)).toBe(false);
    });

  });


  describe('initComponentLoaded', () => {

    beforeEach(() => {
      App = {};
      plt = mockPlatform();
      elm = plt.domApi.$createElement('ion-cmp') as any;
      plt.defineComponent({
        tagNameMeta: 'ion-cmp'
      });
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

  });

});
