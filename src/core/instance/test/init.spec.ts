import { mockPlatform, mockDomApi } from '../../../testing/mocks';
import { ComponentInstance, HostElement, PlatformApi } from '../../../util/interfaces';
import { initLoad, initHostConstructor } from '../init';


describe('instance init', () => {

  describe('initLoad', () => {

    it('should call multiple componentOnReady promises', () => {
      initHostConstructor(plt, elm);

      let called1 = false;
      let called2 = false;

      let p1 = elm.componentOnReady().then(() => {
        called1 = true;
      });

      let p2 = elm.componentOnReady().then(() => {
        called2 = true;
      });

      initLoad(plt, elm);

      return Promise.all([p1, p2]).then(() => {
        expect(called1).toBe(true);
        expect(called2).toBe(true);
      });
    });

    it('should call multiple componentOnReady callbacks', () => {
      initHostConstructor(plt, elm);

      let called1 = false;
      let called2 = false;

      elm.componentOnReady(() => {
        called1 = true;
      });
      elm.componentOnReady(() => {
        called2 = true;
      });

      initLoad(plt, elm);
      expect(called1).toBe(true);
      expect(called2).toBe(true);
    });

  });

  const plt: PlatformApi = <any>mockPlatform();
  const domApi = mockDomApi();
  let elm: HostElement;
  let instance: ComponentInstance;

  class TestInstance {
    state = 'value';
  }

  beforeEach(() => {
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    elm.$instance = instance;
    instance.__el = elm;
  });

});
