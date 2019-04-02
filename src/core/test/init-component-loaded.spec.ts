import * as d from '../../declarations';
import { initHostElement } from '../init-host-element';
import { initComponentLoaded } from '../init-component-instance';
import { mockDomApi, mockPlatform } from '../../testing/mocks';


describe('initComponentLoaded', () => {

  let plt: d.PlatformApi;
  const domApi = mockDomApi();
  let elm: d.HostElement;
  let instance: d.ComponentInstance;
  let cmpMeta: d.ComponentMeta;

  class TestInstance {
    state = 'value';
    componentDidLoad() {/**/}
    componentDidUpdate() {/**/}
  }

  beforeEach(() => {
    plt = mockPlatform();
    cmpMeta = {};
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    plt.instanceMap.set(elm, instance);
    plt.hostElementMap.set(instance, elm);
  });


  it('should call componentDidUpdate() if component is already loaded', () => {
    initHostElement(plt, cmpMeta, elm, 'hydrated');

    const spy = spyOn(instance, 'componentDidUpdate');

    plt.isCmpLoaded.set(elm, true);

    initComponentLoaded(plt, elm, 'hydrated');

    expect(spy).toHaveBeenCalledTimes(1);

    expect(plt.isCmpReady.has(elm)).toBe(true);
    expect(plt.isCmpLoaded.has(elm)).toBe(true);
  });

  it('should not call componentDidLoad() more than once', () => {
    initHostElement(plt, cmpMeta, elm, 'hydrated');

    const spy = spyOn(instance, 'componentDidLoad');

    expect(elm).not.toHaveClass('hydrated');

    elm['s-ld'] = [];

    initComponentLoaded(plt, elm, 'hydrated');
    expect(spy).toHaveBeenCalledTimes(1);

    initComponentLoaded(plt, elm, 'hydrated');
    expect(spy).toHaveBeenCalledTimes(1);

    expect(elm['s-ld']).toBeUndefined();
    expect(elm).toHaveClass('hydrated');

    expect(plt.isCmpReady.has(elm)).toBe(true);
    expect(plt.isCmpLoaded.has(elm)).toBe(true);
  });

});
