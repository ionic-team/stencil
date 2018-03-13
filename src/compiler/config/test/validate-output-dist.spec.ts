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
      dir: 'my-dist',
      buildDir: 'my-build',
      empty: false
    }];
    validateDistOutputTarget(config);
    expect(config.outputTargets[0]).toBeDefined();
    expect(config.outputTargets[0].dir).toBe('/my-dist');
    expect(config.outputTargets[0].buildDir).toBe('/my-dist/my-build');
    expect(config.outputTargets[0].empty).toBe(false);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    config.outputTargets = [
      { type: 'dist' }
    ];
    validateDistOutputTarget(config);
    expect(config.outputTargets[0]).toBeDefined();
    expect(config.outputTargets[0].dir).toBe('/dist');
    expect(config.outputTargets[0].buildDir).toBe('/dist');
    expect(config.outputTargets[0].empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    config.outputTargets = [];
    validateDistOutputTarget(config);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
  });

});
