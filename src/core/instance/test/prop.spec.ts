import { mockPlatform, mockDomApi } from '../../../test';
import { ComponentMeta, HostElement, PlatformApi } from '../../../util/interfaces';
import { ATTR_DASH_CASE, TYPE_ANY } from '../../../util/constants';
import { initProxy } from '../proxy';


describe('instance prop', () => {

  it('should set both getter/setter prop on element', () => {
    cmpMeta = {
      propsMeta: [{
        propName: 'prop',
        attribName: 'prop',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      }]
    };
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'prop');

    expect(propDesc.get.name).toBe('getValue');
    expect(propDesc.set.name).toBe('setValue');
    expect(propDesc.get()).toBe('value');
  });

  it('should set both getter/setter prop on instance w/ isStateful option', () => {
    cmpMeta = {
      propsMeta: [{
        propName: 'prop',
        attribName: 'prop',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: true
      }]
    };
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(instance, 'prop');

    expect(propDesc.get.name).toBe('getValue');
    expect(propDesc.set.name).toBe('setValue');
    expect(propDesc.get()).toBe('value');
  });

  it('should set only getter prop on instance', () => {
    cmpMeta = {
      propsMeta: [{
        propName: 'prop',
        attribName: 'prop',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      }]
    };
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(instance, 'prop');

    expect(propDesc.get.name).toBe('getValue');
    expect(propDesc.set.name).toBe('invalidSetValue');
    expect(propDesc.get()).toBe('value');
  });

  it('should not set prop on instance', () => {
    cmpMeta = {};
    initProxy(plt, elm, instance, cmpMeta);

    const propDesc = Object.getOwnPropertyDescriptor(instance, 'prop');

    expect(propDesc.value).toBe('value');
    expect(propDesc.get).toBeUndefined();
    expect(propDesc.set).toBeUndefined();
  });


  const plt: PlatformApi = <any>mockPlatform();
  const domApi = mockDomApi();
  let elm: HostElement;
  let instance: any;
  let cmpMeta: ComponentMeta;

  class TestInstance {
    prop = 'value';
  }

  beforeEach(() => {
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TestInstance();
    elm.$instance = instance;
    instance.$el = elm;
  });

});
