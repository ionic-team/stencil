import { ATTR_LOWER_CASE } from '../../../util/constants';
import { setProcessEnvironment, validateBuildConfig } from '../validation';
import { BuildConfig, PrerenderConfig } from '../../../util/interfaces';
import { mockFs, mockLogger, mockStencilSystem } from '../../../testing/mocks';
import * as path from 'path';


describe('validation', () => {

  describe('validateBuildConfig', () => {

    it('should default hashedFileNameLength', () => {
      validateBuildConfig(config);
      expect(config.hashedFileNameLength).toBe(8);
    });

    it('should default hashFileNames to false in watch mode despite prod mode', () => {
      config.watch = true;
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

    it('should default hashFileNames to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set minifyJs to true', () => {
      config.devMode = true;
      config.minifyJs = true;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(false);
    });

    it('should set minifyCss to true', () => {
      config.devMode = true;
      config.minifyCss = true;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(false);
    });

    it('should default watch to false', () => {
      validateBuildConfig(config);
      expect(config.watch).toBe(false);
    });

    it('should set devMode to false', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.devMode).toBe(false);
    });

    it('should set devMode to true', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.devMode).toBe(true);
    });

    it('should default devMode to false', () => {
      validateBuildConfig(config);
      expect(config.devMode).toBe(false);
    });

    it('should set publicPath from custom buildDir', () => {
      config.wwwDir = 'some-www';
      config.buildDir = 'some-build';
      validateBuildConfig(config);
      expect(config.publicPath).toBe('/some-build/');
      expect(path.isAbsolute(config.publicPath)).toBe(true);
    });

    it('should set publicPath and not force absolute path, but suffix with /', () => {
      config.publicPath = 'my-crazy-public-path';
      validateBuildConfig(config);
      expect(config.publicPath).toBe('my-crazy-public-path/');
    });

    it('should set default publicPath and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(config.publicPath).toBe('/build/');
    });

    it('should set default wwwIndexHtml and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.wwwIndexHtml)).toBe('index.html');
      expect(path.isAbsolute(config.wwwIndexHtml)).toBe(true);
    });

    it('should set default indexHtmlSrc and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.srcIndexHtml)).toBe('index.html');
      expect(path.isAbsolute(config.srcIndexHtml)).toBe(true);
    });

    it('should set default dist dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.distDir)).toBe('dist');
      expect(path.isAbsolute(config.distDir)).toBe(true);
    });

    it('should set default emptyDist to false', () => {
      validateBuildConfig(config);
      expect(config.emptyDist).toBe(false);
    });

    it('should set emptyDist to true', () => {
      config.emptyDist = true;
      validateBuildConfig(config);
      expect(config.emptyDist).toBe(true);
    });

    it('should set default emptyWWW to false', () => {
      validateBuildConfig(config);
      expect(config.emptyWWW).toBe(false);
    });

    it('should set emptyWWW to true', () => {
      config.emptyWWW = true;
      validateBuildConfig(config);
      expect(config.emptyWWW).toBe(true);
    });

    it('should set default collection dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.collectionDir)).toBe('collection');
      expect(path.isAbsolute(config.collectionDir)).toBe(true);
    });

    it('should set generateDistribution to true', () => {
      config.generateDistribution = true;
      validateBuildConfig(config);
      expect(config.generateDistribution).toBe(true);
    });

    it('should default generateDistribution to false', () => {
      validateBuildConfig(config);
      expect(config.generateDistribution).toBe(false);
    });

    it('should set generateWWW to false', () => {
      config.generateWWW = false;
      validateBuildConfig(config);
      expect(config.generateWWW).toBe(false);
    });

    it('should default generateWWW to true', () => {
      validateBuildConfig(config);
      expect(config.generateWWW).toBe(true);
    });

    it('should set default www dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.wwwDir)).toBe('www');
      expect(path.isAbsolute(config.wwwDir)).toBe(true);
    });

    it('should set default build dir and convert to absolute path', () => {
      validateBuildConfig(config);
      const parts = config.buildDir.split(path.sep);
      expect(parts[parts.length - 1]).toBe('build');
      expect(parts[parts.length - 2]).toBe('www');
      expect(path.isAbsolute(config.buildDir)).toBe(true);
    });

    it('should set build dir w/ custom www', () => {
      config.wwwDir = 'custom-www';
      validateBuildConfig(config);
      const parts = config.buildDir.split(path.sep);
      expect(parts[parts.length - 1]).toBe('build');
      expect(parts[parts.length - 2]).toBe('custom-www');
      expect(path.isAbsolute(config.buildDir)).toBe(true);
    });

    it('should set default src dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.srcDir)).toBe('src');
      expect(path.isAbsolute(config.srcDir)).toBe(true);
    });

    it('should convert global to absolute path, if a global property was provided', () => {
      config.global = 'src/global/index.ts';
      validateBuildConfig(config);
      expect(path.basename(config.global)).toBe('index.ts');
      expect(path.isAbsolute(config.global)).toBe(true);
    });

    it('should not allow special characters in namespace', () => {
      expect(() => {
        config.namespace = 'My-Namespace';
        validateBuildConfig(config);
      }).toThrow();
      expect(() => {
        config.namespace = 'My/Namespace';
        validateBuildConfig(config);
      }).toThrow();
      expect(() => {
        config.namespace = 'My%20Namespace';
        validateBuildConfig(config);
      }).toThrow();
    });

    it('should not allow number for first character of namespace', () => {
      expect(() => {
        config.namespace = '88MyNamespace';
        validateBuildConfig(config);
      }).toThrow();
    });

    it('should enforce namespace being at least 3 characters', () => {
      expect(() => {
        config.namespace = 'ab';
        validateBuildConfig(config);
      }).toThrow();
    });

    it('should set user namespace', () => {
      config.namespace = 'MyNamespace';
      validateBuildConfig(config);
      expect(config.namespace).toBe('MyNamespace');
    });

    it('should set default namespace', () => {
      validateBuildConfig(config);
      expect(config.namespace).toBe('App');
    });

    it('should throw error for missing sys', () => {
      expect(() => {
        config.sys = null;
        validateBuildConfig(config);
      }).toThrowError('config.sys required');
    });

    it('should throw error for missing logger', () => {
      expect(() => {
        config.logger = null;
        validateBuildConfig(config);
      }).toThrowError('config.logger required');
    });

    it('should throw error for missing rootDir', () => {
      expect(() => {
        config.rootDir = null;
        validateBuildConfig(config);
      }).toThrowError('config.rootDir required');
      expect(() => {
        config.rootDir = undefined;
        validateBuildConfig(config);
      }).toThrowError('config.rootDir required');
    });

    it('should throw error for blank config', () => {
      expect(() => {
        validateBuildConfig(null);
      }).toThrowError('invalid build config');
      expect(() => {
        validateBuildConfig(undefined);
      }).toThrowError('invalid build config');
    });

  });

  describe('setProcessEnvironment', () => {

    it('should set NODE_ENV production', () => {
      config.devMode = false;
      setProcessEnvironment(config);
      expect(process.env.NODE_ENV).toBe('production');
    });

    it('should set NODE_ENV development', () => {
      config.devMode = true;
      setProcessEnvironment(config);
      expect(process.env.NODE_ENV).toBe('development');
    });

  });

  describe('copy tasks', () => {

    it('should remove default copy task', () => {
      config.copy = {
        assets: null
      };
      validateBuildConfig(config);
      expect(config.copy.assets).toBe(null);
      expect(config.copy.manifestJson.src).toBe('manifest.json');
    });

    it('should add copy task and keep defaults', () => {
      config.copy = {
        someTask: { src: 'some-dir' }
      };
      validateBuildConfig(config);
      expect(config.copy.someTask.src).toBe('some-dir');
      expect(config.copy.assets.src).toBe('assets');
      expect(config.copy.manifestJson.src).toBe('manifest.json');
    });

    it('should override "assets" copy task default', () => {
      config.copy = {
        assets: { src: 'my-assets', dest: 'some-assets' }
      };
      validateBuildConfig(config);
      expect(config.copy.assets.src).toBe('my-assets');
      expect(config.copy.assets.dest).toBe('some-assets');
    });

    it('should set "assets" copy task default', () => {
      validateBuildConfig(config);
      expect(config.copy.assets.src).toBe('assets');
      expect(config.copy.assets.dest).toBeUndefined();
    });

    it('should override "manifestJson" copy task default', () => {
      config.copy = {
        manifestJson: { src: 'my-manifestJson', dest: 'some-manifestJson' }
      };
      validateBuildConfig(config);
      expect(config.copy.manifestJson.src).toBe('my-manifestJson');
      expect(config.copy.manifestJson.dest).toBe('some-manifestJson');
    });

    it('should set "manifestJson" copy task default', () => {
      validateBuildConfig(config);
      expect(config.copy.manifestJson.src).toBe('manifest.json');
      expect(config.copy.manifestJson.dest).toBeUndefined();
    });

  });

  var sys = mockStencilSystem();
  var config: BuildConfig;
  var logger = mockLogger();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true
    };
  });
  sys.fs = mockFs();

});
