import { Config } from '../../../declarations';
import { validateWwwOutputTarget } from '../validate-outputs-www';
import * as path from 'path';


describe('validateWwwOutputTarget', () => {

  let config: Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: '/'
    };
  });

  it('should set www values', () => {
    config.outputTargets = [{
      type: 'www',
      path: 'my-www',
      buildPath: 'my-build',
      indexHtml: 'my-index.htm',
      empty: false
    }];
    validateWwwOutputTarget(config);
    expect(config.outputTargets[0]).toBeDefined();
    expect(config.outputTargets[0].type).toBe('www');
    expect(config.outputTargets[0].path).toBe('/my-www');
    expect(config.outputTargets[0].buildPath).toBe('/my-www/my-build');
    expect(config.outputTargets[0].indexHtml).toBe('/my-www/my-index.htm');
    expect(config.outputTargets[0].empty).toBe(false);
  });

  it('should default to add www when outputTargets is undefined', () => {
    validateWwwOutputTarget(config);
    expect(config.outputTargets).toHaveLength(1);
    expect(config.outputTargets[0].path).toBe('/www');
    expect(config.outputTargets[0].buildPath).toBe('/www/build');
    expect(config.outputTargets[0].indexHtml).toBe('/www/index.html');
    expect(config.outputTargets[0].empty).toBe(true);
  });

  it('should default to not add www when outputTargets exists, but without www', () => {
    config.outputTargets = [];
    validateWwwOutputTarget(config);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(false);
  });

});
