import type * as d from '@stencil/core/declarations';
import { RollupInputOptions, RollupOutputOptions } from '@stencil/core/declarations';
import { validateRollupConfig } from '../validate-rollup-config';

describe('validateStats', () => {
  let config: d.Config;

  beforeEach(() => {
    config = {};
  });

  it('should use default if no config provided', () => {
    validateRollupConfig(config);
    expect(config).toEqual({
      rollupConfig: {
        inputOptions: {},
        outputOptions: {},
      },
    });
  });
  it('should use default if inputOptions is not provided but outputOptions is', () => {
    config.rollupConfig = {
      inputOptions: {
        context: 'window',
      },
    };
    validateRollupConfig(config);
    expect(config).toEqual({
      rollupConfig: {
        inputOptions: {
          context: 'window',
        },
        outputOptions: {},
      },
    });
  });

  it('should use default if inputOptions is not provided but outputOptions is', () => {
    config.rollupConfig = {
      outputOptions: {
        globals: {
          jquery: '$',
        },
      },
    };

    validateRollupConfig(config);
    expect(config).toEqual({
      rollupConfig: {
        inputOptions: {},
        outputOptions: {
          globals: {
            jquery: '$',
          },
        },
      },
    });
  });

  it('should pass all valid config data through and not those that are extraneous', () => {
    config.rollupConfig = {
      inputOptions: {
        context: 'window',
        notAnOption: {},
      },
      outputOptions: {
        globals: {
          jquery: '$',
        },
      },
    } as d.RollupConfig;

    validateRollupConfig(config);
    expect(config).toEqual({
      rollupConfig: {
        inputOptions: {
          context: 'window',
        },
        outputOptions: {
          globals: {
            jquery: '$',
          },
        },
      },
    });
  });

  describe('input properties validation', () => {
    const testInputOptions: Required<RollupInputOptions> = {
      context: 'window',
      moduleContext: {},
      preserveSymlinks: true,
      treeshake: false,
    };

    for (const property of Object.keys(testInputOptions)) {
      const value = testInputOptions[property as keyof RollupInputOptions];

      it(`should pass through the valid inputOption '${property}'`, () => {
        config.rollupConfig = {
          inputOptions: {
            [property]: value,
          },
        };

        validateRollupConfig(config);
        expect(config).toEqual({
          rollupConfig: {
            inputOptions: {
              [property]: value,
            },
            outputOptions: {},
          },
        });
      });
    }
  });

  describe('output properties validation', () => {
    const outputTestOptions: Required<RollupOutputOptions> = {'globals': {}};

    for (const property of Object.keys(outputTestOptions)) {
      const value = outputTestOptions[property as keyof RollupOutputOptions];

      it(`should pass through the valid outputOption '${property}'`, () => {
        config.rollupConfig = {
          outputOptions: {
            [property]: value,
          },
        };

        validateRollupConfig(config);
        expect(config).toEqual({
          rollupConfig: {
            inputOptions: {},
            outputOptions: {
              [property]: value,
            },
          },
        });
      });
    }
  });
});
