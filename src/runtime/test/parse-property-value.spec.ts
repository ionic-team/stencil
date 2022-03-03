import { parsePropertyValue } from '../parse-property-value';
import { MEMBER_FLAGS } from '../../utils';

describe('parse-property-value', () => {
  describe('parsePropertyValue', () => {
    describe('boolean coercion', () => {
      it('coerces the string "false" to boolean false', () => {
        const result = parsePropertyValue('false', MEMBER_FLAGS.Boolean);
        expect(result).toBe(false);
      });

      it('coerces the string "False" to boolean true', () => {
        const result = parsePropertyValue('False', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces an empty string to boolean true', () => {
        const result = parsePropertyValue('', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces the string "true" to boolean true', () => {
        const result = parsePropertyValue('true', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces the number 0 to boolean false', () => {
        const result = parsePropertyValue(0, MEMBER_FLAGS.Boolean);
        expect(result).toBe(false);
      });

      it('coerces the string "0" to boolean true', () => {
        const result = parsePropertyValue('0', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces the number 1 to boolean true', () => {
        const result = parsePropertyValue(1, MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces the string "1" to boolean true', () => {
        const result = parsePropertyValue('1', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('does not coerce null to boolean', () => {
        const result = parsePropertyValue(null, MEMBER_FLAGS.Boolean);
        expect(result).toBe(null);
      });

      it('coerces the string "null" to boolean true', () => {
        const result = parsePropertyValue('null', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('does not coerce undefined to boolean', () => {
        const result = parsePropertyValue(undefined, MEMBER_FLAGS.Boolean);
        expect(result).toBe(undefined);
      });

      it('coerces the string "undefined" to boolean true', () => {
        const result = parsePropertyValue('undefined', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });

      it('coerces NaN to boolean false', () => {
        const result = parsePropertyValue(NaN, MEMBER_FLAGS.Boolean);
        expect(result).toBe(false);
      });

      it('coerces the string "NaN" to boolean true', () => {
        const result = parsePropertyValue('NaN', MEMBER_FLAGS.Boolean);
        expect(result).toBe(true);
      });
    });

    describe('number coercion', () => {
      it('coerces a number value to a number', () => {
        const result = parsePropertyValue(42, MEMBER_FLAGS.Number);
        expect(result).toBe(42);
      });

      it('coerces a stringified value to a number', () => {
        const result = parsePropertyValue('42', MEMBER_FLAGS.Number);
        expect(result).toBe(42);
      });

      it('coerces a float value to a number', () => {
        const result = parsePropertyValue('4.2', MEMBER_FLAGS.Number);
        expect(result).toBe(4.2);
      });

      it('coerces a positive value to a number', () => {
        const result = parsePropertyValue('+4.2', MEMBER_FLAGS.Number);
        expect(result).toBe(4.2);
      });

      it('coerces a negative value to a number', () => {
        const result = parsePropertyValue('-4.2', MEMBER_FLAGS.Number);
        expect(result).toBe(-4.2);
      });

      it('coerces a stringified scientific value to a number', () => {
        const result = parsePropertyValue('42e1', MEMBER_FLAGS.Number);
        expect(result).toBe(420);
      });

      it('returns NaN when parsing a boolean', () => {
        const result = parsePropertyValue(true, MEMBER_FLAGS.Number);
        expect(result).toBe(NaN);
      });

      it('returns NaN when parsing a string', () => {
        const result = parsePropertyValue('hello world', MEMBER_FLAGS.Number);
        expect(result).toBe(NaN);
      });

      it('returns an object prop unchanged', () => {
        const originalProp = { hello: 'world' };
        const result = parsePropertyValue(originalProp, MEMBER_FLAGS.Number);
        expect(result).toBe(originalProp);
      });

      it('returns an undefined prop unchanged', () => {
        const result = parsePropertyValue(undefined, MEMBER_FLAGS.Number);
        expect(result).toBe(undefined);
      });

      it('returns a null prop unchanged', () => {
        const result = parsePropertyValue(null, MEMBER_FLAGS.Number);
        expect(result).toBe(null);
      });

      it('returns NaN when NaN is received', () => {
        const result = parsePropertyValue(NaN, MEMBER_FLAGS.Number);
        expect(result).toBe(NaN);
      });
    });
  });
});
