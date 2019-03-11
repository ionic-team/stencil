import * as d from '../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateStats } from '../validate-stats';


describe('validateStats', () => {

  let config: d.Config;

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: '/User/some/path/',
      srcDir: '/User/some/path/src/',
      flags: {},
      outputTargets: [{
        type: 'www',
        dir: '/www'
      } as any as d.OutputTargetStats]
    };
  });


  it('adds stats from flags, w/ no outputTargets', () => {
    config.flags.stats = true;

    validateStats(config);
    const o = config.outputTargets.find(o => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('stencil-stats.json');
  });

  it('uses stats config, custom path', () => {
    config.outputTargets.push({
      type: 'stats',
      file: 'custom-path.json'
    } as d.OutputTargetStats);
    validateStats(config);
    const o = config.outputTargets.find(o => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('custom-path.json');
  });

  it('uses stats config, defaults file', () => {
    config.outputTargets.push({
      type: 'stats'
    });
    validateStats(config);
    const o = config.outputTargets.find(o => o.type === 'stats') as d.OutputTargetStats;
    expect(o).toBeDefined();
    expect(o.file).toContain('stencil-stats.json');
  });

  it('default no stats', () => {
    validateStats(config);
    expect(config.outputTargets.some(o => o.type === 'stats')).toBe(false);
  });

});
