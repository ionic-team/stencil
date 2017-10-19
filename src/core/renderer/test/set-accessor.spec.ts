import { setAccessor } from '../update-dom-node';
import { mockElement, mockPlatform } from '../../../testing/mocks';

describe('setAccessor', () => {
  const plt: any = mockPlatform();

  it('should set undefined property to child with existing property', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    Object.defineProperty(elm, 'myprop', {
      set: () => {},
      get: () => 'getterValue'
    });

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe('getterValue');
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeDefined();
  });

  it('should set object property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = { some: 'obj' };

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set array property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = [1, 2, 3];

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set function property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = function meFun(){};

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set null property to child and it is a child prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeNull();
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set string property to child when child already has that property', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe('stringval');
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should do nothing when setting null prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should do nothing when setting undefined prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeUndefined();
  });

  it('should set false boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = false;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('false');
  });

  it('should set true boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = true;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('true');
  });

  it('should set number to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 88;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('88');
  });

  it('should set string to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('stringval');
  });

  var elm: any;
  beforeEach(() => {
    elm = mockElement('my-tag');
  });

});
