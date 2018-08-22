import { ComponentMeta, PlatformApi } from '../../declarations';
import { MEMBER_TYPE } from '../../util/constants';
import { mockDocument, mockPlatform } from '../../testing/mocks';
import { proxyHostElementPrototype } from '../proxy-host-element';


describe('proxyHostElementPrototype', () => {

  const plt: PlatformApi = mockPlatform() as any;
  let cmpMeta: ComponentMeta;
  let elm: any;

  beforeEach(() => {
    cmpMeta = {};
    const doc = mockDocument();
    elm = doc.createElement('my-cmp');
  });


  it('gets undefined without errors before values set', () => {
    cmpMeta.membersMeta = {
      'myProp': { memberType: MEMBER_TYPE.Prop }
    };
    proxyHostElementPrototype(plt, cmpMeta.membersMeta, elm);
    expect(elm.myProp).toBeUndefined();
  });

  it('defines prop and prop mutable', () => {
    cmpMeta.membersMeta = {
      'myProp': { memberType: MEMBER_TYPE.Prop },
      'myPropMutable': { memberType: MEMBER_TYPE.PropMutable }
    };
    proxyHostElementPrototype(plt, cmpMeta.membersMeta, elm);

    const myProp = Object.getOwnPropertyDescriptor(elm, 'myProp');
    expect(myProp.get).toBeDefined();
    expect(myProp.set).toBeDefined();

    const myPropMutable = Object.getOwnPropertyDescriptor(elm, 'myPropMutable');
    expect(myPropMutable.get).toBeDefined();
    expect(myPropMutable.set).toBeDefined();
  });

  it('defines noop method', () => {
    cmpMeta.membersMeta = {
      'myMethod': { memberType: MEMBER_TYPE.Method }
    };
    proxyHostElementPrototype(plt, cmpMeta.membersMeta, elm);
    const prop = Object.getOwnPropertyDescriptor(elm, 'myMethod');
    expect(prop.value).toBeDefined();
    expect(typeof prop.value).toBe('function');
  });

  it('does nothing for member types we dont care about on the host', () => {
    cmpMeta.membersMeta = {
      'myState': { memberType: MEMBER_TYPE.State },
      'myElement': { memberType: MEMBER_TYPE.Element },
      'myPropConnect': { memberType: MEMBER_TYPE.PropConnect },
      'myPropContext': { memberType: MEMBER_TYPE.PropContext }
    };
    proxyHostElementPrototype(plt, cmpMeta.membersMeta, elm);
    expect(Object.getOwnPropertyDescriptor(elm, 'myState')).toBeUndefined();
    expect(Object.getOwnPropertyDescriptor(elm, 'myElement')).toBeUndefined();
    expect(Object.getOwnPropertyDescriptor(elm, 'myPropConnect')).toBeUndefined();
    expect(Object.getOwnPropertyDescriptor(elm, 'myPropContext')).toBeUndefined();
  });

  it('do nothing for no members', () => {
    expect(() => {
      proxyHostElementPrototype(plt, cmpMeta.membersMeta, elm);
    }).not.toThrow();
  });

});
