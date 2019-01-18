import * as d from '@declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateResourcesUrl', () => {

  let config: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();
  let outputTarget: d.OutputTargetWww;

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/'
    };
  });

  // resourcesUrl is url the loader script should use to find
  // the core script, and where the core script should use to find component modules
  // the name of the loader script is the namespace lowercased
  // and by default the resourcesUrl is the buildDir + lowercased namespace
  //
  // DEFAULTS:
  // - build/
  //   - app/
  //     - app.core.js (core script)
  //     - my-cmp-a.js (component)
  //   - app.js (loader script)
  // - index.html (contains <script src="build/app.js"/>)

  it('custom resourcesUrl, absolute', () => {
    outputTarget = {
      type: 'www',
      resourcesUrl: '/somewhere/else'
    };
    config.outputTargets = [outputTarget];
    validateConfig(config);
    expect((config.outputTargets[0] as d.OutputTargetWww).resourcesUrl).toBe('/somewhere/else/');
    expect(path.isAbsolute(outputTarget.resourcesUrl)).toBe(true);
  });

  it('custom resourcesUrl, relative to loader (app.js)', () => {
    outputTarget = {
      type: 'www',
      resourcesUrl: 'somewhere/else'
    };
    config.outputTargets = [outputTarget];
    validateConfig(config);
    expect(outputTarget.resourcesUrl).toBe('somewhere/else/');
    expect(path.isAbsolute(outputTarget.resourcesUrl)).toBe(false);
  });

  it('do not set resourcesUrl w/ custom path and buildDir', () => {
    outputTarget = {
      type: 'www',
      dir: 'some-www',
      buildDir: 'some-build'
    };
    config.outputTargets = [outputTarget];
    validateConfig(config);
    expect(outputTarget.resourcesUrl).toBeUndefined();
  });

  it('do not set resourcesUrl w/ custom buildDir', () => {
    outputTarget = {
      type: 'www',
      buildDir: 'some-build'
    };
    config.outputTargets = [outputTarget];
    validateConfig(config);
    expect(outputTarget.resourcesUrl).toBeUndefined();
  });

  it('no default resourcesUrl', () => {
    outputTarget = {
      type: 'www'
    };
    config.outputTargets = [outputTarget];
    validateConfig(config);
    expect(outputTarget.resourcesUrl).toBeUndefined();
  });

});
