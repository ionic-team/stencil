import type * as d from '@stencil/core/declarations';
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

  it('should set based on inputOptions if provided', () => {
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
});
