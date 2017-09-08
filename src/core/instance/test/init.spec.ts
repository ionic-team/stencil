import { mockPlatform, mockDomApi } from '../../../test';
import { ComponentInstance, HostElement, PlatformApi } from '../../../util/interfaces';
import { initLoad, initHostConstructor } from '../init';


describe('instance init', () => {

  describe('initLoad', () => {

    it('should call multiple componentOnReady promises', (done) => {
      initHostConstructor(plt, elm);

      let called1 = false;
      let called2 = false;

      elm.componentOnReady().then(() => {
        called1 = true;

      }).then(() => {
        called2 = true;
        done();
      });

      initLoad(plt, elm);
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
