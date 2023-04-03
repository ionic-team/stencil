import { dashToPascalCase, isDef, isPromise, omit, toCamelCase, toDashCase } from '../helpers';

describe('util helpers', () => {
  describe('isPromise', () => {
    it('is promise', () => {
      const asyncFn = async () => 42;
      const someFn = () => {};
      someFn.then = () => {};
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
      expect(isPromise(asyncFn())).toBe(true);
      expect(isPromise({ then: function () {} })).toBe(true);
      expect(isPromise(someFn)).toBe(true);
    });

    it('not promise', () => {
      expect(isPromise('')).toBe(false);
      expect(isPromise('then')).toBe(false);
      expect(isPromise(true)).toBe(false);
      expect(isPromise(false)).toBe(false);
      expect(isPromise({})).toBe(false);
      expect(isPromise({ then: true })).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise([true])).toBe(false);
      expect(isPromise(() => {})).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise(0)).toBe(false);
      expect(isPromise(-88)).toBe(false);
      expect(isPromise(88)).toBe(false);
    });
  });

  describe('dashToPascalCase', () => {
    it('my-3d-component => My3dComponent', () => {
      expect(dashToPascalCase('my-3d-component')).toBe('My3dComponent');
    });

    it('madison-wisconsin => MadisonWisconsin', () => {
      expect(dashToPascalCase('madison-wisconsin')).toBe('MadisonWisconsin');
    });

    it('wisconsin => Wisconsin', () => {
      expect(dashToPascalCase('wisconsin')).toBe('Wisconsin');
    });
  });

  describe('omit', () => {
    it('should omit a key', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['a'])).toEqual({ b: 2, c: 3 });
    });

    it('should omit several keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['a', 'b'])).toEqual({ c: 3 });
    });
  });

  describe('toCamelCase', () => {
    it.each([
      ['my-3d-component', 'my3dComponent'],
      ['madison-wisconsin', 'madisonWisconsin'],
      ['wisconsin', 'wisconsin'],
    ])('%s => %s', (input: string, exp: string) => {
      expect(toCamelCase(input)).toBe(exp);
    });
  });

  describe('toDashCase', () => {
    it('My3dComponent => my-3d-component', () => {
      expect(toDashCase('My3dComponent')).toBe('my-3d-component');
    });

    it('MadisonWisconsin => madison-wisconsin', () => {
      expect(toDashCase('MadisonWisconsin')).toBe('madison-wisconsin');
    });

    it('madisonWisconsin => madison-wisconsin', () => {
      expect(toDashCase('madisonWisconsin')).toBe('madison-wisconsin');
    });

    it('Wisconsin => wisconsin', () => {
      expect(toDashCase('Wisconsin')).toBe('wisconsin');
    });

    it('wisconsin => wisconsin', () => {
      expect(toDashCase('wisconsin')).toBe('wisconsin');
    });
  });

  describe('isDef', () => {
    it('number', () => {
      expect(isDef(88)).toBe(true);
    });

    it('string', () => {
      expect(isDef('str')).toBe(true);
    });

    it('object', () => {
      expect(isDef({})).toBe(true);
    });

    it('array', () => {
      expect(isDef([])).toBe(true);
    });

    it('false', () => {
      expect(isDef(false)).toBe(true);
    });

    it('true', () => {
      expect(isDef(true)).toBe(true);
    });

    it('undefined', () => {
      expect(isDef(undefined)).toBe(false);
    });

    it('null', () => {
      expect(isDef(null)).toBe(false);
    });
  });
});
