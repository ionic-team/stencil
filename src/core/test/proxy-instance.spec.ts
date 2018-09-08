import * as d from '../../declarations';
import { mockDocument, mockPlatform } from '../../testing/mocks';
import { proxyComponentInstance } from '../proxy-component-instance';


describe('proxyComponentInstance', () => {

  let plt: d.PlatformApi;
  let cmpConstructor: d.ComponentConstructor;
  let elm: d.HostElement;
  let instance: any;
  let hostSnapshot: d.HostSnapshot;

  beforeEach(() => {
    plt = mockPlatform();
    cmpConstructor = {};
    const doc = mockDocument();
    elm = doc.createElement('my-cmp');
    instance = {};
    hostSnapshot = {};
  });


  it('should get attr value even if existin data is empty string', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };
    plt.valuesMap.set(elm, { propVal: '' });
    hostSnapshot.$attributes = {
      'prop-val': 'elm-attr-val'
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

    expect(instance.propVal).toBe('elm-attr-val');
  });

  it('should prioritize elm prop over instance prop', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };
    (elm as any).propVal = 'elm-prop-val';
    instance.propVal = 'instance-prop-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

    expect(instance.propVal).toBe('elm-prop-val');
  });

  it('should prioritize elm attr value over elm prop and instance prop', () => {
    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' }
    };

    hostSnapshot.$attributes = {
      'prop-val': 'elm-attr-val'
    };

    (elm as any).propVal = 'elm-prop-val';
    instance.propVal = 'instance-prop-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

    expect(instance.propVal).toBe('elm-attr-val');
  });

  it('should get instance prop values for prop/prop mutable', () => {
    cmpConstructor.properties = {
      propVal: { type: String },
      propMutableVal: { type: String, mutable: true }
    };
    instance.propVal = 'prop-val';
    instance.propMutableVal = 'prop-mutable-val';
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

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
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

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
    hostSnapshot.$attributes = {
      'prop-val': 'prop-val',
      'prop-mutable-val': 'prop-mutable-val'
    };

    cmpConstructor.properties = {
      propVal: { type: String, attr: 'prop-val' },
      propMutableVal: { type: String, mutable: true, attr: 'prop-mutable-val' }
    };

    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);

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
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
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
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(instance.mystate).toBeUndefined();
  });

  it('should not get elm attribute values for state', () => {
    cmpConstructor.properties = {
      mystate: { state: true }
    };
    elm.setAttribute('mystate', 'invalid');
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(instance.mystate).toBeUndefined();
  });

  it('defines element', () => {
    cmpConstructor.properties = {
      myElement: { elementRef: true }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    const myElement = Object.getOwnPropertyDescriptor(instance, 'myElement');
    expect(myElement.value).toBe(elm);
    expect(myElement.get).toBeUndefined();
    expect(myElement.set).toBeUndefined();
    expect(instance.myElement).toBe(elm);
  });

  it('defines falsey prop context', () => {
    plt.getContextItem = () => {
      return false;
    };
    cmpConstructor.properties = {
      isServer: { context: 'isServer' }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(instance.isServer).toBe(false);
  });

  it('defines prop context', () => {
    spyOn(plt, 'getContextItem');
    cmpConstructor.properties = {
      myPropContext: { context: 'ctrlId' }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(plt.getContextItem).toHaveBeenCalled();
  });

  it('defines prop connect', () => {
    spyOn(plt, 'propConnect');
    cmpConstructor.properties = {
      myPropConnect: { connect: 'ctrlId' }
    };
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    const myPropConnect = Object.getOwnPropertyDescriptor(instance, 'myPropConnect');
    expect(plt.propConnect).toHaveBeenCalled();
    expect(myPropConnect).toBeDefined();
  });

  it('reused existing internal values', () => {
    plt.valuesMap.set(elm, { mph: 88 });
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(plt.valuesMap.get(elm).mph).toBe(88);
  });

  it('create new internal values', () => {
    proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    expect(plt.valuesMap.get(elm)).toBeDefined();
  });

  it('do nothing for no members', () => {
    expect(() => {
      proxyComponentInstance(plt, cmpConstructor, elm, instance, hostSnapshot);
    }).not.toThrow();
  });

});
