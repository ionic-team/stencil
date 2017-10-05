import { mockPlatform, mockDomApi } from '../../../testing/mocks';
import { ComponentMeta, ComponentInstance, HostElement, PlatformApi } from '../../../util/interfaces';
import { initProxy } from '../proxy';
import { MEMBER_TYPE } from '../../../util/constants';


describe('instance state', () => {

  it('should not set state on element', () => {
    cmpMeta = {
      membersMeta: {
        'state': { memberType: MEMBER_TYPE.State }
      }
    };
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'state');

    expect(propDesc).toBeUndefined();
  });

  it('should set state on instance', () => {
    cmpMeta = {
      membersMeta: {
        'state': { memberType: MEMBER_TYPE.State }
      }
    };
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(instance, 'state');

    expect(propDesc.get).toBeDefined();
    expect(propDesc.set).toBeDefined();
    expect(propDesc.get()).toBe('value');
  });

  it('should not set state', () => {
    cmpMeta = {};
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(instance, 'state');

    expect(propDesc.value).toBe('value');
    expect(propDesc.get).toBeUndefined();
    expect(propDesc.set).toBeUndefined();
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
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    elm.$instance = instance;
    instance.__el = elm;
  });

});
