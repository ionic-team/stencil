import * as d from '../../../declarations';
import { _deprecatedToMultipleTarget } from '../_deprecated-validate-multiple-targets';
import { mockLogger } from '../../../testing/mocks';


describe('_deprecated multiple targets', () => {

  let config: d.Config;
  const logger = mockLogger();

  beforeEach(() => {
    config = {
      logger: logger,
      flags: {}
    };
  });


  it('serviceWorker, create outputTargets', () => {
    (config as any).serviceWorker = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).serviceWorker).toBeUndefined();
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect(((config.outputTargets[0] as d.OutputTargetWww) as d.OutputTargetWww).serviceWorker).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('serviceWorker', () => {
    (config as any).serviceWorker = true;
    config.outputTargets = [ { type: 'www' } ];
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).serviceWorker).toBeUndefined();
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).serviceWorker).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('resourcePath', () => {
    (config as any).publicPath = 'my-resource-path';
    config.outputTargets = [ { type: 'www' }, { type: 'dist' } ];
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).resourcePath).toBeUndefined();
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).resourcePath).toBe('my-resource-path');
    expect(r).toHaveLength(1);
  });

  it('typesDir', () => {
    (config as any).typesDir = 'my-types';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).typesDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe('my-types');
    expect(r).toHaveLength(1);
  });

  it('collectionDir', () => {
    (config as any).collectionDir = 'my-collection';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).collectionDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe('my-collection');
    expect(r).toHaveLength(1);
  });

  it('emptyDist true', () => {
    (config as any).emptyDist = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyDist).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect((config.outputTargets[0] as d.OutputTargetWww).empty).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('emptyDist false', () => {
    (config as any).emptyDist = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyDist).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect((config.outputTargets[0] as d.OutputTargetWww).empty).toBe(false);
    expect(r).toHaveLength(1);
  });

  it('distDir', () => {
    (config as any).distDir = 'my-dist';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).distDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe('my-dist');
    expect(r).toHaveLength(1);
  });

  it('generateDistribution true', () => {
    (config as any).generateDistribution = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateDistribution).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('dist');
    expect(r).toHaveLength(1);
  });

  it('generateDistribution false', () => {
    (config as any).generateDistribution = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateDistribution).toBeUndefined();
    expect(config.outputTargets).toBeUndefined();
    expect(r).toHaveLength(1);
  });

  it('wwwIndexHtml', () => {
    (config as any).wwwIndexHtml = 'my-index.html';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).wwwIndexHtml).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).indexHtml).toBe('my-index.html');
    expect(r).toHaveLength(1);
  });

  it('buildDir', () => {
    (config as any).buildDir = 'my-build';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).buildDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).buildDir).toBe('my-build');
    expect(r).toHaveLength(1);
  });

  it('wwwDir', () => {
    (config as any).wwwDir = 'my-www';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).wwwDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).dir).toBe('my-www');
    expect(r).toHaveLength(1);
  });

  it('emptyWWW true', () => {
    (config as any).emptyWWW = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).empty).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('emptyWWW false', () => {
    (config as any).emptyWWW = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect((config.outputTargets[0] as d.OutputTargetWww).empty).toBe(false);
    expect(r).toHaveLength(1);
  });

  it('generateWWW true', () => {
    (config as any).generateWWW = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect((config.outputTargets[0] as d.OutputTargetWww).type).toBe('www');
    expect(r).toHaveLength(1);
  });

  it('generateWWW false', () => {
    (config as any).generateWWW = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateWWW).toBeUndefined();
    expect(config.outputTargets).toBeUndefined();
    expect(r).toHaveLength(1);
  });

  it('should do nothing if no old configs', () => {
    config.outputTargets = [];
    const r = _deprecatedToMultipleTarget(config);
    expect(config.outputTargets).toHaveLength(0);
    expect(r).toHaveLength(0);
  });

});
