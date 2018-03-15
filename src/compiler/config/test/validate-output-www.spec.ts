import * as d from '../../../declarations';
import { validateOutputTargetWww } from '../validate-outputs-www';
import * as path from 'path';


describe('validateOutputTargetWww', () => {

  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: '/',
      flags: {}
    };
  });

  it('should www with sub directory', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: 'www/docs'
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.dir).toBe('/www/docs');
    expect(outputTarget.buildDir).toBe('/www/docs/build');
    expect(outputTarget.indexHtml).toBe('/www/docs/index.html');
  });

  it('should set www values', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: 'my-www',
      buildDir: 'my-build',
      indexHtml: 'my-index.htm',
      empty: false
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config);

    expect(outputTarget.type).toBe('www');
    expect(outputTarget.dir).toBe('/my-www');
    expect(outputTarget.buildDir).toBe('/my-www/my-build');
    expect(outputTarget.indexHtml).toBe('/my-www/my-index.htm');
    expect(outputTarget.empty).toBe(false);
  });

  it('should default to add www when outputTargets is undefined', () => {
    validateOutputTargetWww(config);
    expect(config.outputTargets).toHaveLength(1);

    const outputTarget = (config.outputTargets as d.OutputTargetWww[]).find(o => o.type === 'www');
    expect(outputTarget.dir).toBe('/www');
    expect(outputTarget.buildDir).toBe('/www/build');
    expect(outputTarget.indexHtml).toBe('/www/index.html');
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add www when outputTargets exists, but without www', () => {
    config.outputTargets = [];
    validateOutputTargetWww(config);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(false);
  });

});
