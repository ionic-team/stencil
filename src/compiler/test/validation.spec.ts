import { validateAttrCase, validateBuildConfig } from '../validation';
import { BuildConfig } from '../interfaces';
import { ATTR_DASH_CASE, ATTR_LOWER_CASE } from '../../util/constants';
import { mockFs, mockLogger, mockStencilSystem } from '../../test';
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

    it('should set default staticBuildDir and convert to relative path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.staticBuildDir)).toBe('build');
      expect(path.isAbsolute(config.staticBuildDir)).toBe(false);
    });

    it('should set default indexDest and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.indexDest)).toBe('index.html');
      expect(path.isAbsolute(config.indexDest)).toBe(true);
    });

    it('should set default indexSrc and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.indexSrc)).toBe('index.html');
      expect(path.isAbsolute(config.indexSrc)).toBe(true);
    });

    it('should set default collection dest dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.collectionDest)).toBe('collection');
      expect(path.isAbsolute(config.collectionDest)).toBe(true);
    });

    it('should set default build dest dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.buildDest)).toBe('build');
      expect(path.isAbsolute(config.buildDest)).toBe(true);
    });

    it('should set default src dir and convert to absolute path', () => {
      validateBuildConfig(config);
      expect(path.basename(config.src)).toBe('src');
      expect(path.isAbsolute(config.src)).toBe(true);
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
