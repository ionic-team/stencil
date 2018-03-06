import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateBuildConfig } from '../validate-config';
import * as path from 'path';


describe('validatePublicPath', () => {

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


  it('should set publicPath from custom buildDir', () => {
    config.outputTargets = {
      www: {
        dir: 'some-www',
        buildDir: 'some-build'
      }
    };
    validateBuildConfig(config);
    expect(config.publicPath).toBe('/some-build/');
    expect(path.isAbsolute(config.publicPath)).toBe(true);
  });

  it('should set publicPath and not force absolute path, but suffix with /', () => {
    config.publicPath = 'my-crazy-public-path';
    validateBuildConfig(config);
    expect(config.publicPath).toBe('my-crazy-public-path/');
  });

  it('should set discoverPublicPath to false if custom publicPath', () => {
    config.publicPath = '/my-crazy-public-path/app/';
    validateBuildConfig(config);
    expect(config.publicPath).toBe('/my-crazy-public-path/app/');
    expect(config.discoverPublicPath).toBe(false);
  });

  it('should set default publicPath, set discoverPublicPath true, and convert to absolute path', () => {
    validateBuildConfig(config);
    expect(config.publicPath).toBe('/build/');
    expect(config.discoverPublicPath).toBe(true);
  });

});
