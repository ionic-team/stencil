import { mockPlatform, mockDomApi } from '../../../testing/mocks';
import { ComponentInstance, ComponentMeta, HostElement, PlatformApi } from '../../../util/interfaces';
import { initHostElement } from '../init-host-element';
import { initComponentLoaded } from '../init-component-instance';


describe('instance init', () => {

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

      initComponentLoaded(plt, elm);

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

      initComponentLoaded(plt, elm);
      expect(called1).toBe(true);
      expect(called2).toBe(true);
    });

  });

  it('should call onReady before initHostElement', () => {
    let called1 = false;
    let called2 = false;

    elm.onReady = () => {
      called1 = true;
    };

    initHostElement(plt, cmpMeta, elm);

    elm.componentOnReady(() => {
      called2 = true;
    });

    initComponentLoaded(plt, elm);
    expect(called1).toBe(true);
    expect(called2).toBe(true);
  });


  it('should call onReady after initHostElement', () => {
    let called1 = false;
    let called2 = false;

    initHostElement(plt, cmpMeta, elm);

    elm.onReady = () => {
      called2 = true;
    };

    elm.componentOnReady(() => {
      called1 = true;
    });

    initComponentLoaded(plt, elm);
    expect(called1).toBe(true);
    expect(called2).toBe(true);
  });

});

  const plt: PlatformApi = <any>mockPlatform();
  const domApi = mockDomApi();
  let elm: HostElement;
  let instance: ComponentInstance;
  let cmpMeta: ComponentMeta;

  class TestInstance {
    state = 'value';
  }

  beforeEach(() => {
    cmpMeta = {};
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    elm._instance = instance;
    instance.__el = elm;
  });

});
