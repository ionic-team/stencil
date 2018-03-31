import { dashToPascalCase, isDef, toDashCase } from '../helpers';


describe('util helpers', () => {

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
