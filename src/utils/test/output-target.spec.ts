import { DIST_TYPES, VALID_CONFIG_OUTPUT_TARGETS } from '../constants';
import { isValidConfigOutputTarget } from '../output-target';

describe('output-utils tests', () => {
  describe('isValidConfigOutputTarget', () => {
    it.each(VALID_CONFIG_OUTPUT_TARGETS)('should return true for valid output type "%s"', (outputTargetType) => {
      expect(isValidConfigOutputTarget(outputTargetType)).toBe(true);
    });

    it.each(['', 'my-target-that-i-made-up', DIST_TYPES])(
      'should return false for invalid config output type "%s"',
      (outputTargetType) => {
        expect(isValidConfigOutputTarget(outputTargetType)).toBe(false);
      }
    );
  });
});
