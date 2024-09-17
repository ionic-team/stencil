import { mockValidatedConfig } from '@stencil/core/testing';

import type * as d from '../../../declarations';
import { DEFAULT_DOCS_README_COLORS, isHexColor, validateReadmeOutputTarget } from '../outputs/validate-docs';

describe('validateDocs', () => {
  describe('isHexColor', () => {
    it('should return true for valid hex colors', () => {
      expect(isHexColor('#FFF')).toBe(true);
      expect(isHexColor('#FFFFFF')).toBe(true);
      expect(isHexColor('#000000')).toBe(true);
      expect(isHexColor('#f0f0f0')).toBe(true);
      expect(isHexColor('#aBcDeF')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isHexColor('FFF')).toBe(false);
      expect(isHexColor('#GGGGGG')).toBe(false);
      expect(isHexColor('#FF')).toBe(false);
      expect(isHexColor('#FFFFFFF')).toBe(false);
      expect(isHexColor('#FF0000FF')).toBe(false);
    });

    it('should return false for non-string inputs', () => {
      expect(isHexColor('123')).toBe(false);
      expect(isHexColor('true')).toBe(false);
      expect(isHexColor('{}')).toBe(false);
      expect(isHexColor('[]')).toBe(false);
    });
  });

  describe('validateReadmeOutputTarget', () => {
    let config: d.ValidatedConfig;
    let outputTarget: d.OutputTargetDocsReadme;

    beforeEach(() => {
      config = mockValidatedConfig();
      outputTarget = {
        type: 'docs-readme',
      };
    });

    it('should use the default diagram colors if not provided', () => {
      const validatedOutputTarget = validateReadmeOutputTarget(config, outputTarget);

      expect(validatedOutputTarget.colors).toEqual(DEFAULT_DOCS_README_COLORS);
    });

    it('should use the default diagram colors if the provided colors are invalid', () => {
      outputTarget.colors = {
        text: 'invalid-color',
        background: 'invalid-color',
      };

      const validatedOutputTarget = validateReadmeOutputTarget(config, outputTarget);

      expect(validatedOutputTarget.colors).toEqual(DEFAULT_DOCS_README_COLORS);
    });

    it('should use the provided colors if they are valid', () => {
      outputTarget.colors = {
        text: '#000000',
        background: '#FFFFFF',
      };

      const validatedOutputTarget = validateReadmeOutputTarget(config, outputTarget);

      expect(validatedOutputTarget.colors).toEqual(outputTarget.colors);
    });
  });
});
