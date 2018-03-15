import * as d from '../../../declarations';
import { validateOutputTargetDist } from '../validate-outputs-dist';
import * as path from 'path';


describe('validateDistOutputTarget', () => {

  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: '/'
    };
  });

  it('should set dist values', () => {
    const outputTarget: d.OutputTargetDist = {
      type: 'dist',
      dir: 'my-dist',
      buildDir: 'my-build',
      empty: false
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetDist(config);
    expect(config.outputTargets).toHaveLength(1);
    expect(outputTarget).toBeDefined();
    expect(outputTarget.dir).toBe('/my-dist');
    expect(outputTarget.buildDir).toBe('/my-dist/my-build');
    expect(outputTarget.empty).toBe(false);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    config.outputTargets = [
      { type: 'dist' }
    ];
    validateOutputTargetDist(config);
    const outputTarget: d.OutputTargetDist = config.outputTargets.find(o => o.type === 'dist');
    expect(outputTarget).toBeDefined();
    expect(outputTarget.dir).toBe('/dist');
    expect(outputTarget.buildDir).toBe('/dist');
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    config.outputTargets = [];
    validateOutputTargetDist(config);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
  });

});
