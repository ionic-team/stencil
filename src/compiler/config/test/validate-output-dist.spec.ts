import { Config } from '../../../declarations';
import { validateDistOutputTarget } from '../validate-outputs-dist';
import * as path from 'path';


describe('validateDistOutputTarget', () => {

  let config: Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: '/'
    };
  });

  it('should set dist values', () => {
    config.outputTargets = [{
      type: 'dist',
      path: 'my-dist',
      buildPath: 'my-build',
      empty: false
    }];
    validateDistOutputTarget(config);
    expect(config.outputTargets[0]).toBeDefined();
    expect(config.outputTargets[0].path).toBe('/my-dist');
    expect(config.outputTargets[0].buildPath).toBe('/my-dist/my-build');
    expect(config.outputTargets[0].empty).toBe(false);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    config.outputTargets = [
      { type: 'dist' }
    ];
    validateDistOutputTarget(config);
    expect(config.outputTargets[0]).toBeDefined();
    expect(config.outputTargets[0].path).toBe('/dist');
    expect(config.outputTargets[0].buildPath).toBe('/dist');
    expect(config.outputTargets[0].empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    config.outputTargets = [];
    validateDistOutputTarget(config);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
  });

});
