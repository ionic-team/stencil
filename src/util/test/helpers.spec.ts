import { dashToPascalCase, toDashCase } from '../helpers';


describe('util helpers', () => {

  describe('dashToPascalCase', () => {

    it('madison-wisconsin => MadisonWisconsin', () => {
      expect(dashToPascalCase('madison-wisconsin')).toBe('MadisonWisconsin');
    });

    it('wisconsin => Wisconsin', () => {
      expect(dashToPascalCase('wisconsin')).toBe('Wisconsin');
    });

  });

  describe('toDashCase', () => {

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

});
