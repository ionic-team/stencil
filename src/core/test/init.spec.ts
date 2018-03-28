import * as d from '../../declarations';
import { initHostElement } from '../init-host-element';
import { initComponentLoaded } from '../init-component-instance';
import { mockDomApi, mockPlatform } from '../../testing/mocks';


describe('instance init', () => {

  let plt: d.PlatformApi;
  const domApi = mockDomApi();
  let elm: d.HostElement;
  let instance: d.ComponentInstance;
  let cmpMeta: d.ComponentMeta;

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
