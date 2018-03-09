import { _deprecatedToMultipleTarget } from '../_deprecated-validate-multiple-targets';
import { Config } from '../../../declarations';
import { mockLogger } from '../../../testing/mocks';


describe('_deprecated multiple targets', () => {

  let config: Config;
  const logger = mockLogger();

  beforeEach(() => {
    config = {
      logger: logger,
      flags: {}
    };
  });


  it('discoverPublicPath', () => {
    (config as any).discoverPublicPath = true;
    config.outputTargets = [ { type: 'www' }, { type: 'dist' } ];
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).discoverPublicPath).toBeUndefined();
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].discoverPublicPath).toBe(true);
    expect(config.outputTargets[1].type).toBe('dist');
    expect(config.outputTargets[1].discoverPublicPath).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('publicPath', () => {
    (config as any).publicPath = 'my-public-path';
    config.outputTargets = [ { type: 'www' }, { type: 'dist' } ];
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).publicPath).toBeUndefined();
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].publicPath).toBe('my-public-path');
    expect(config.outputTargets[1].type).toBe('dist');
    expect(config.outputTargets[1].publicPath).toBe('my-public-path');
    expect(r).toHaveLength(1);
  });

  it('typesDir', () => {
    (config as any).typesDir = 'my-types';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).typesDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
    expect(config.outputTargets[0].dir).toBe('my-types');
    expect(r).toHaveLength(1);
  });

  it('collectionDir', () => {
    (config as any).collectionDir = 'my-collection';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).collectionDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
    expect(config.outputTargets[0].dir).toBe('my-collection');
    expect(r).toHaveLength(1);
  });

  it('emptyDist true', () => {
    (config as any).emptyDist = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyDist).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
    expect(config.outputTargets[0].emptyDir).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('emptyDist false', () => {
    (config as any).emptyDist = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyDist).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
    expect(config.outputTargets[0].emptyDir).toBe(false);
    expect(r).toHaveLength(1);
  });

  it('distDir', () => {
    (config as any).distDir = 'my-dist';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).distDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
    expect(config.outputTargets[0].dir).toBe('my-dist');
    expect(r).toHaveLength(1);
  });

  it('generateDistribution true', () => {
    (config as any).generateDistribution = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateDistribution).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('dist');
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
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].indexHtml).toBe('my-index.html');
    expect(r).toHaveLength(1);
  });

  it('buildDir', () => {
    (config as any).buildDir = 'my-build';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).buildDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].buildDir).toBe('my-build');
    expect(r).toHaveLength(1);
  });

  it('wwwDir', () => {
    (config as any).wwwDir = 'my-www';
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).wwwDir).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].dir).toBe('my-www');
    expect(r).toHaveLength(1);
  });

  it('emptyWWW true', () => {
    (config as any).emptyWWW = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].emptyDir).toBe(true);
    expect(r).toHaveLength(1);
  });

  it('emptyWWW false', () => {
    (config as any).emptyWWW = false;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).emptyWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].emptyDir).toBe(false);
    expect(r).toHaveLength(1);
  });

  it('generateWWW true', () => {
    (config as any).generateWWW = true;
    const r = _deprecatedToMultipleTarget(config);
    expect((config as any).generateWWW).toBeUndefined();
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].type).toBe('www');
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
