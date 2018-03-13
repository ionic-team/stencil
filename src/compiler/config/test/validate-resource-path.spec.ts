import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateResourcePath', () => {

  let config: Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true
    };
  });

  // resourcePath is url the loader script should use to find
  // the core script, and where the core script should use to find component modules
  // the name of the loader script is the namespace lowercased
  // and by default the resourcePath is the buildDir + lowercased namespace
  //
  // DEFAULTS:
  // - build/
  //   - app/
  //     - app.core.js (core script)
  //     - my-cmp-a.js (component)
  //   - app.js (loader script)
  // - index.html (contains <script src="build/app.js"/>)

  it('custom resourcePath, absolute', () => {
    config.outputTargets = [{
      type: 'www',
      resourcePath: '/somewhere/else'
    }];
    validateConfig(config);
    expect(config.outputTargets[0].resourcePath).toBe('/somewhere/else/');
    expect(path.isAbsolute(config.outputTargets[0].resourcePath)).toBe(true);
  });

  it('custom resourcePath, relative to loader (app.js)', () => {
    config.outputTargets = [{
      type: 'www',
      resourcePath: 'somewhere/else'
    }];
    validateConfig(config);
    expect(config.outputTargets[0].resourcePath).toBe('somewhere/else/');
    expect(path.isAbsolute(config.outputTargets[0].resourcePath)).toBe(false);
  });

  it('do not set resourcePath w/ custom path and buildDir', () => {
    config.outputTargets = [{
      type: 'www',
      dir: 'some-www',
      buildDir: 'some-build'
    }];
    validateConfig(config);
    expect(config.outputTargets[0].resourcePath).toBeUndefined();
  });

  it('do not set resourcePath w/ custom buildDir', () => {
    config.outputTargets = [{
      type: 'www',
      buildDir: 'some-build'
    }];
    validateConfig(config);
    expect(config.outputTargets[0].resourcePath).toBeUndefined();
  });

  it('no default resourcePath', () => {
    config.outputTargets = [{
      type: 'www'
    }];
    validateConfig(config);
    expect(config.outputTargets[0].resourcePath).toBeUndefined();
  });

});
