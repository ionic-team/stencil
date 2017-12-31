import { ComponentConstructor, HostElement, PlatformApi } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import { mockElement, mockPlatform } from '../../../testing/mocks';
import { proxyComponentInstance } from '../proxy-component-instance';


describe('proxyComponentInstance', () => {

  it('should get attr value even if existin data is empty string', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };
    elm._values = { propVal: '' };
    elm.setAttribute('prop-val', 'elm-attr-val');
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('elm-attr-val');
  });

  it('should prioritize elm prop over instance prop', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };
    (elm as any).propVal = 'elm-prop-val';
    instance.propVal = 'instance-prop-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('elm-prop-val');
  });

  it('should prioritize elm attr value over elm prop and instance prop', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };
    elm.setAttribute('prop-val', 'elm-attr-val');
    (elm as any).propVal = 'elm-prop-val';
    instance.propVal = 'instance-prop-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('elm-attr-val');
  });

  it('should get instance prop values for prop/prop mutable', () => {
    cmpConstructor.properties = {
      propVal: { type: String },
      propMutableVal: { type: String, mutable: true }
    };
    instance.propVal = 'prop-val';
    instance.propMutableVal = 'prop-mutable-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('prop-val');
    expect(instance.propMutableVal).toBe('prop-mutable-val');

    const propVal = Object.getOwnPropertyDescriptor(instance, 'propVal');
    expect(propVal.value).toBeUndefined();
    expect(propVal.get).toBeDefined();
    expect(propVal.set).toBeDefined();

    const propMutableVal = Object.getOwnPropertyDescriptor(instance, 'propMutableVal');
    expect(propMutableVal.value).toBeUndefined();
    expect(propMutableVal.get).toBeDefined();
    expect(propMutableVal.set).toBeDefined();
  });

  it('should get elm prop values for prop/prop mutable', () => {
    cmpConstructor.properties = {
      propVal: { type: String },
      propMutableVal: { type: String, mutable: true }
    };
    (elm as any).propVal = 'prop-val';
    (elm as any).propMutableVal = 'prop-mutable-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('prop-val');
    expect(instance.propMutableVal).toBe('prop-mutable-val');

    const propVal = Object.getOwnPropertyDescriptor(instance, 'propVal');
    expect(propVal.value).toBeUndefined();
    expect(propVal.get).toBeDefined();
    expect(propVal.set).toBeDefined();

    const propMutableVal = Object.getOwnPropertyDescriptor(instance, 'propMutableVal');
    expect(propMutableVal.value).toBeUndefined();
    expect(propMutableVal.get).toBeDefined();
    expect(propMutableVal.set).toBeDefined();
  });

  it('should get elm attr values for prop/prop mutable', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' },
      propMutableVal: { type: String, mutable: true, attr: 'prop-mutable-val' }
    };
    elm.setAttribute('prop-val', 'prop-val');
    elm.setAttribute('prop-mutable-val', 'prop-mutable-val');
    proxyComponentInstance(plt, cmpConstructor, elm, instance);

    expect(instance.propVal).toBe('prop-val');
    expect(instance.propMutableVal).toBe('prop-mutable-val');

    const propVal = Object.getOwnPropertyDescriptor(instance, 'propVal');
    expect(propVal.value).toBeUndefined();
    expect(propVal.get).toBeDefined();
    expect(propVal.set).toBeDefined();

    const propMutableVal = Object.getOwnPropertyDescriptor(instance, 'propMutableVal');
    expect(propMutableVal.value).toBeUndefined();
    expect(propMutableVal.get).toBeDefined();
    expect(propMutableVal.set).toBeDefined();
  });

  it('should get instance property values for state and set getter/setter', () => {
    cmpConstructor.properties = {
      stateVal: { state: true }
    };
    instance.stateVal = 'some-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(instance.stateVal).toBe('some-val');
    const stateVal = Object.getOwnPropertyDescriptor(instance, 'stateVal');
    expect(stateVal.value).toBeUndefined();
    expect(stateVal.get).toBeDefined();
    expect(stateVal.set).toBeDefined();
  });

  it('should not get elm property values for state', () => {
    cmpConstructor.properties = {
      mystate: { state: true }
    };
    (elm as any).mystate = 'invalid';
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(instance.mystate).toBeUndefined();
  });

  it('should not get elm attribute values for state', () => {
    cmpConstructor.properties = {
      mystate: { state: true }
    };
    elm.setAttribute('mystate', 'invalid');
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(instance.mystate).toBeUndefined();
  });

  it('defines element', () => {
    cmpConstructor.properties = {
      myElement: { elementRef: true }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    const myElement = Object.getOwnPropertyDescriptor(instance, 'myElement');
    expect(myElement.value).toBe(elm);
    expect(myElement.get).toBeUndefined();
    expect(myElement.set).toBeUndefined();
    expect(instance.myElement).toBe(elm);
  });

  it('defines prop context', () => {
    spyOn(plt, 'getContextItem');
    cmpConstructor.properties = {
      myPropContext: { context: 'ctrlId' }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(plt.getContextItem).toHaveBeenCalled();
  });

  it('defines prop connect', () => {
    spyOn(plt, 'propConnect');
    cmpConstructor.properties = {
      myPropConnect: { connect: 'ctrlId' }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    const myPropConnect = Object.getOwnPropertyDescriptor(instance, 'myPropConnect');
    expect(plt.propConnect).toHaveBeenCalled();
    expect(myPropConnect).toBeDefined();
  });

  it('reused existing internal values', () => {
    elm._values = { mph: 88 };
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(elm._values.mph).toBe(88);
  });

  it('create new internal values', () => {
    proxyComponentInstance(plt, cmpConstructor, elm, instance);
    expect(elm._values).toBeDefined();
  });

  it('do nothing for no members', () => {
    expect(() => {
      proxyComponentInstance(plt, cmpConstructor, elm, instance);
    }).not.toThrow();
  });

  var plt: PlatformApi = mockPlatform() as any;
  var cmpConstructor: ComponentConstructor;
  var elm: HostElement;
  var instance: any;

  beforeEach(() => {
    cmpConstructor = {};
    elm = mockElement('my-cmp') as any;
    instance = {};
  });

});
