import { parsePropertyValue } from '../data-parse';


describe('parsePropertyValue', () => {

  describe('any', () => {

    it('should keep boolean false', () => {
      expect(parsePropertyValue('Any', false)).toBe(false);
    });

    it('should keep boolean true', () => {
      expect(parsePropertyValue('Any', true)).toBe(true);
    });

    it('should keep number 1', () => {
      expect(parsePropertyValue('Any', 1)).toBe(1);
    });

    it('should keep number 0', () => {
      expect(parsePropertyValue('Any', 0)).toBe(0);
    });

    it('should keep number -1', () => {
      expect(parsePropertyValue('Any', -1)).toBe(-1);
    });

    it('should keep NaN', () => {
      expect(parsePropertyValue('Any', NaN)).toBe(NaN);
    });

    it('should keep string', () => {
      expect(parsePropertyValue('Any', 'str')).toBe('str');
    });

    it('should keep null', () => {
      expect(parsePropertyValue('Any', null)).toBe(null);
    });

    it('should keep undefined', () => {
      expect(parsePropertyValue('Any', undefined)).toBe(undefined);
    });

    it('should keep Array', () => {
      expect(parsePropertyValue('Any', [88, 'mph'])).toEqual([88, 'mph']);
    });

    it('should keep Function', () => {
      const a = function() { return; };
      expect(parsePropertyValue('Any', a)).toEqual(a);
    });

    it('should keep Object', () => {
      expect(parsePropertyValue('Any', { mph: 88 })).toEqual({ mph: 88 });
    });

  });

  describe('string', () => {

    it('should convert boolean false to string', () => {
      expect(parsePropertyValue(String, false)).toBe('false');
    });

    it('should convert boolean true to string', () => {
      expect(parsePropertyValue(String, true)).toBe('true');
    });

    it('should convert number 88 to string "88"', () => {
      expect(parsePropertyValue(String, 88)).toBe('88');
    });

    it('should convert number 0 to string "0"', () => {
      expect(parsePropertyValue(String, 0)).toBe('0');
    });

    it('should convert number -1 to string "-1"', () => {
      expect(parsePropertyValue(String, -1)).toBe('-1');
    });

    it('should convert NaN to string', () => {
      expect(parsePropertyValue(String, NaN)).toBe('NaN');
    });

    it('should keep Function', () => {
      const a = function() { return; };
      expect(parsePropertyValue(String, a)).toEqual(a);
    });

    it('should keep leave object as is', () => {
      expect(parsePropertyValue(String, {'mph': 88})).toEqual({'mph': 88});
    });

    it('should keep leave array as is', () => {
      expect(parsePropertyValue(String, [88, 'mph'])).toEqual([88, 'mph']);
    });

    it('should keep empty string ""', () => {
      expect(parsePropertyValue(String, '')).toEqual('');
    });

    it('should keep string as string', () => {
      expect(parsePropertyValue(String, 'str')).toEqual('str');
    });

    it('should keep string undefined as undefined', () => {
      expect(parsePropertyValue(String, undefined)).toEqual(undefined);
    });

    it('should keep string null as null', () => {
      expect(parsePropertyValue(String, null)).toBe(null);
    });

  });

  describe('number', () => {

    it('should convert number 1 to number 1', () => {
      expect(parsePropertyValue(Number, 1)).toBe(1);
    });

    it('should convert number 0 to number 0', () => {
      expect(parsePropertyValue(Number, 0)).toBe(0);
    });

    it('should convert string "0" to number 0', () => {
      expect(parsePropertyValue(Number, '0')).toBe(0);
    });

    it('should convert string "88" to number 88', () => {
      expect(parsePropertyValue(Number, '88')).toBe(88);
    });

    it('should convert empty string "" to NaN', () => {
      expect(parsePropertyValue(Number, '')).toEqual(NaN);
    });

    it('should convert any string "anyword" to NaN', () => {
      expect(parsePropertyValue(Number, 'anyword')).toEqual(NaN);
    });

    it('should keep leave object as is', () => {
      expect(parsePropertyValue(Number, {'mph': 88})).toEqual({'mph': 88});
    });

    it('should keep leave array as is', () => {
      expect(parsePropertyValue(Number, [88, 'mph'])).toEqual([88, 'mph']);
    });

    it('should keep Function', () => {
      const a = function() { return; };
      expect(parsePropertyValue(Number, a)).toEqual(a);
    });

    it('should keep number undefined as undefined', () => {
      expect(parsePropertyValue(Number, undefined)).toEqual(undefined);
    });

    it('should keep number null as null', () => {
      expect(parsePropertyValue(Number, null)).toBe(null);
    });

  });

  describe('boolean', () => {

    it('should set boolean 1 as true', () => {
      expect(parsePropertyValue(Boolean, 1)).toBe(true);
    });

    it('should set boolean 0 as false', () => {
      expect(parsePropertyValue(Boolean, 0)).toBe(false);
    });

    it('should keep boolean true as boolean true', () => {
      expect(parsePropertyValue(Boolean, true)).toBe(true);
    });

    it('should keep boolean false as boolean false', () => {
      expect(parsePropertyValue(Boolean, false)).toBe(false);
    });

    it('should convert string "false" to boolean false', () => {
      expect(parsePropertyValue(Boolean, 'false')).toBe(false);
    });

    it('should convert string "true" to boolean true', () => {
      expect(parsePropertyValue(Boolean, 'true')).toBe(true);
    });

    it('should convert empty string "" to boolean true', () => {
      expect(parsePropertyValue(Boolean, '')).toBe(true);
    });

    it('should convert any string "anyword" to boolean true', () => {
      expect(parsePropertyValue(Boolean, 'anyword')).toBe(true);
    });

    it('should keep Function', () => {
      const a = function() { return; };
      expect(parsePropertyValue(Boolean, a)).toEqual(a);
    });

    it('should keep leave object as is', () => {
      expect(parsePropertyValue(Boolean, {'mph': 88})).toEqual({'mph': 88});
    });

    it('should keep leave array as is', () => {
      expect(parsePropertyValue(Boolean, [88, 'mph'])).toEqual([88, 'mph']);
    });

    it('should keep boolean undefined as undefined', () => {
      expect(parsePropertyValue(Boolean, undefined)).toBe(undefined);
    });

    it('should keep boolean null as null', () => {
      expect(parsePropertyValue(Boolean, null)).toBe(null);
    });

  });

});
