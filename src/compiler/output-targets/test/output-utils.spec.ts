import { DIST_TYPES, isValidConfigOutputTarget, VALID_CONFIG_OUTPUT_TARGETS } from '../output-utils';

describe('output-utils tests', () => {
  describe('isValidConfigOutputTarget', () => {
    it.each(VALID_CONFIG_OUTPUT_TARGETS)('should return true for valid output types', (outputTargetType) => {
      expect(isValidConfigOutputTarget(outputTargetType)).toBe(true);
    });

    it.each(['', 'my-target-that-i-made-up', DIST_TYPES])(
      'should return false for invalid config output types',
      (outputTargetType) => {
        expect(isValidConfigOutputTarget(outputTargetType)).toBe(false);
      }
    );
  });
});
