import { ComponentInstance, ComponentMeta, HostElement, PlatformApi } from '../../../declarations';
import { initHostElement } from '../init-host-element';
import { initComponentLoaded } from '../init-component-instance';
import { mockDomApi, mockPlatform } from '../../../testing/mocks';


describe('instance init', () => {

  let plt: PlatformApi;
  const domApi = mockDomApi();
  let elm: HostElement;
  let instance: ComponentInstance;
  let cmpMeta: ComponentMeta;

  class TestInstance {
    state = 'value';
    componentDidLoad() {/**/}
  }

  beforeEach(() => {
    plt = mockPlatform();
    cmpMeta = {};
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    plt.instanceMap.set(elm, instance);
    plt.hostElementMap.set(instance, elm);
  });


  describe('initLoad', () => {

    it('should call multiple componentOnReady promises', () => {
      initHostElement(plt, cmpMeta, elm);

      let called1 = false;
      let called2 = false;

      const p1 = elm.componentOnReady().then(() => {
        called1 = true;
      });

      const p2 = elm.componentOnReady().then(() => {
        called2 = true;
      });

      initComponentLoaded(plt, elm, 'hydrated');

      return Promise.all([p1, p2]).then(() => {
        expect(called1).toBe(true);
        expect(called2).toBe(true);
      });
    });

    it('should call multiple componentOnReady callbacks', () => {
      initHostElement(plt, cmpMeta, elm);

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

    it('should not call componentDidLoad() more than once', () => {
      initHostElement(plt, cmpMeta, elm);

      const spy = spyOn(instance, 'componentDidLoad');

      initComponentLoaded(plt, elm, 'hydrated');
      expect(spy).toHaveBeenCalledTimes(1);

      initComponentLoaded(plt, elm, 'hydrated');
      expect(spy).toHaveBeenCalledTimes(1);
    });

  });

});
