import { validateAttrCase, validateBuildConfig } from '../validation';
import { BuildConfig } from '../../interfaces';
import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../../../util/constants';
import { mockFs, mockLogger, mockStencilSystem } from '../../../test';
import * as path from 'path';


describe('validation', () => {

  describe('validateAttrCase', () => {

    it('should set lower case', () => {
      var attrCase = validateAttrCase('lower');
      expect(attrCase).toBe(ATTR_LOWER_CASE);
    });

    it('should set dash case', () => {
      var attrCase = validateAttrCase('dash');
      expect(attrCase).toBe(ATTR_DASH_CASE);
    });

    it('should keep attribute dash case when given constant', () => {
      var attrCase = validateAttrCase(ATTR_DASH_CASE);
      expect(attrCase).toBe(ATTR_DASH_CASE);

      attrCase = validateAttrCase(ATTR_LOWER_CASE);
      expect(attrCase).toBe(ATTR_LOWER_CASE);
    });

    it('should default attribute dash case', () => {
      var attrCase = validateAttrCase(config.attrCase);
      expect(attrCase).toBe(ATTR_DASH_CASE);
    });

  });

  describe('validateBuildConfig', () => {

    it('should default prerenderIndex.removeUnusedCss', () => {
      validateBuildConfig(config);
      expect(config.prerenderIndex.removeUnusedCss).toBe(true);
    });

    it('should default prerenderIndex.reduceHtmlWhitepace', () => {
      validateBuildConfig(config);
      expect(config.prerenderIndex.reduceHtmlWhitepace).toBe(true);
    });

    it('should default prerenderIndex.inlineLoaderScript', () => {
      validateBuildConfig(config);
      expect(config.prerenderIndex.inlineLoaderScript).toBe(true);
    });

    it('should merge prerenderIndex config', () => {
      config.prerenderIndex = { html: '<div></div>' };
      validateBuildConfig(config);
      expect(config.prerenderIndex.inlineLoaderScript).toBe(true);
    });

    it('should default prerenderIndex', () => {
      validateBuildConfig(config);
      expect(config.prerenderIndex).toBeDefined();
    });

    it('should not set prerenderIndex if null', () => {
      config.prerenderIndex = null;
      validateBuildConfig(config);
      expect(config.prerenderIndex).toBe(null);
    });

    it('should default generateCollection to false', () => {
      validateBuildConfig(config);
      expect(config.generateCollection).toBe(false);
    });

    it('should default hashedFileNameLength', () => {
      validateBuildConfig(config);
      expect(config.hashedFileNameLength).toBe(12);
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

    it('should default hashFileNames to false', () => {
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

    it('should default minifyJs to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyCss to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to false', () => {
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(false);
    });

    it('should default minifyJs to false', () => {
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(false);
    });

    it('should default watch to false', () => {
      validateBuildConfig(config);
      expect(config.watch).toBe(false);
    });

    it('should default devMode to true', () => {
      validateBuildConfig(config);
      expect(config.devMode).toBe(true);
    });

    it('should set publicPath from custom buildDir', () => {
      config.indexHtmlBuild = '/my/custom/index.html';
      config.buildDir = '/my/custom/build-dist';
      validateBuildConfig(config);
      expect(config.publicPath).toBe('build-dist/');
      expect(path.isAbsolute(config.publicPath)).toBe(false);
    });

    it('should set default publicPath and convert to relative path', () => {
      validateBuildConfig(config);
      expect(config.publicPath).toBe('build/');
    });

    it('should set default indexHtmlBuild and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.indexHtmlBuild)).toBe('index.html');
      expect(path.isAbsolute(config.indexHtmlBuild)).toBe(true);
    });

    it('should set default indexHtmlSrc and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.indexHtmlSrc)).toBe('index.html');
      expect(path.isAbsolute(config.indexHtmlSrc)).toBe(true);
    });

    it('should set default collection dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.collectionDir)).toBe('collection');
      expect(path.isAbsolute(config.collectionDir)).toBe(true);
    });

    it('should set default build dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.buildDir)).toBe('build');
      expect(path.isAbsolute(config.buildDir)).toBe(true);
    });

    it('should set default src dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.src)).toBe('src');
      expect(path.isAbsolute(config.src)).toBe(true);
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
