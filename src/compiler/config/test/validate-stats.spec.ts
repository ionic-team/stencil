import type * as d from '@stencil/core/declarations';
import { mockConfig } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';

describe('validateStats', () => {
  let userConfig: d.Config;

  beforeEach(() => {
    userConfig = mockConfig();
  });

  it('adds stats from flags, w/ no outputTargets', () => {
    userConfig.flags.stats = true;

    const { config } = validateConfig(userConfig);
    const o = config.outputTargets.find((o) => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('stencil-stats.json');
  });

  it('uses stats config, custom path', () => {
    userConfig.outputTargets = [
      {
        type: 'stats',
        file: 'custom-path.json',
      } as d.OutputTargetStats,
    ];
    const { config } = validateConfig(userConfig);
    const o = config.outputTargets.find((o) => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('custom-path.json');
  });

  it('uses stats config, defaults file', () => {
    userConfig.outputTargets = [
      {
        type: 'stats',
      },
    ];
    const { config } = validateConfig(userConfig);
    const o = config.outputTargets.find((o) => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('stencil-stats.json');
  });

  it('default no stats', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some((o) => o.type === 'stats')).toBe(false);
  });
});
