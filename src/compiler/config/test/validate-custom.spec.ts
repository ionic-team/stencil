import * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { validateOutputTargetCustom } from '../validate-outputs-custom';
import { buildWarn } from '@utils';

describe('validateCustom', () => {
  let config: d.Config;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      flags: {},
      outputTargets: [],
    };
  });

  it('should log warning', () => {
    config.outputTargets = [
      {
        type: 'custom',
        name: 'test',
        validate: (_, diagnostics) => {
          const warn = buildWarn(diagnostics);
          warn.messageText = 'test warning';
        },
        generator: async () => {
          return;
        },
      },
    ];
    const diagnostics: d.Diagnostic[] = [];
    validateOutputTargetCustom(config, diagnostics);
    expect(diagnostics.length).toBe(1);
  });
});
