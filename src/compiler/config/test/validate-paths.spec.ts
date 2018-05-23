import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validatePaths', () => {

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


  it('should set default wwwIndexHtml and convert to absolute path', () => {
    validateConfig(config);
    expect(path.basename(config.outputTargets[0].indexHtml)).toBe('index.html');
    expect(path.isAbsolute(config.outputTargets[0].indexHtml)).toBe(true);
  });

  it('should convert a custom wwwIndexHtml to absolute path', () => {
    config.outputTargets = [{
      type: 'www',
      indexHtml: 'assets/custom-index.html'
    }];
    validateConfig(config);
    expect(path.basename(config.outputTargets[0].indexHtml)).toBe('custom-index.html');
    expect(path.isAbsolute(config.outputTargets[0].indexHtml)).toBe(true);
  });

  it('should set default indexHtmlSrc and convert to absolute path', () => {
    validateConfig(config);
    expect(path.basename(config.srcIndexHtml)).toBe('index.html');
    expect(path.isAbsolute(config.srcIndexHtml)).toBe(true);
  });

  it('should set emptyDist to false', () => {
    config.outputTargets = [{
      type: 'www',
      empty: false
    }];
    validateConfig(config);
    expect(config.outputTargets[0].empty).toBe(false);
  });

  it('should set default emptyWWW to true', () => {
    validateConfig(config);
    expect(config.outputTargets[0].empty).toBe(true);
  });

  it('should set emptyWWW to false', () => {
    config.outputTargets = [{
      type: 'www',
      empty: false
    }];
    validateConfig(config);
    expect(config.outputTargets[0].empty).toBe(false);
  });

  it('should set default collection dir and convert to absolute path', () => {
    config.outputTargets = [{
      type: 'dist'
    }];
    validateConfig(config);
    expect(path.basename(config.outputTargets[0].collectionDir)).toBe('collection');
    expect(path.isAbsolute(config.outputTargets[0].collectionDir)).toBe(true);
  });

  it('should set default tsconfig and convert to absolute path', () => {
    validateConfig(config);
    expect(path.basename(config.tsconfig)).toBe('tsconfig.json');
    expect(path.isAbsolute(config.tsconfig)).toBe(true);
  });

  it('should set default types dir and convert to absolute path', () => {
    config.outputTargets = [{
      type: 'dist'
    }];
    validateConfig(config);
    expect(path.basename(config.outputTargets[0].typesDir)).toBe('types');
    expect(path.isAbsolute(config.outputTargets[0].typesDir)).toBe(true);
  });

  it('should set default build dir and convert to absolute path', () => {
    validateConfig(config);
    const normalizedPathSep = '/';
    const parts = config.outputTargets[0].buildDir.split(normalizedPathSep);
    expect(parts[parts.length - 1]).toBe('build');
    expect(parts[parts.length - 2]).toBe('www');
    expect(path.isAbsolute(config.outputTargets[0].buildDir)).toBe(true);
  });

  it('should set build dir w/ custom www', () => {
    config.outputTargets = [{
      type: 'www',
      dir: 'custom-www'
    }];
    validateConfig(config);
    const normalizedPathSep = '/';
    const parts = config.outputTargets[0].buildDir.split(normalizedPathSep);
    expect(parts[parts.length - 1]).toBe('build');
    expect(parts[parts.length - 2]).toBe('custom-www');
    expect(path.isAbsolute(config.outputTargets[0].buildDir)).toBe(true);
  });

  it('should set src dir from incorrect config case', () => {
    (config as any).SrcDIR = () => 'myapp';
    validateConfig(config);
    expect(path.basename(config.srcDir)).toBe('myapp');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set src dir from function', () => {
    (config as any).srcDir = () => 'myapp';
    validateConfig(config);
    expect(path.basename(config.srcDir)).toBe('myapp');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set default src dir and convert to absolute path', () => {
    validateConfig(config);
    expect(path.basename(config.srcDir)).toBe('src');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set src dir and convert to absolute path', () => {
    config.srcDir = 'app';
    validateConfig(config);
    expect(path.basename(config.srcDir)).toBe('app');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should convert globalScript to absolute path, if a globalScript property was provided', () => {
    config.globalScript = 'src/global/index.ts';
    validateConfig(config);
    expect(path.basename(config.globalScript)).toBe('index.ts');
    expect(path.isAbsolute(config.globalScript)).toBe(true);
  });

  it('should handle absolute paths on re-validate', () => {
    config.globalStyle = 'src/global/styles1.css';
    validateConfig(config);
    expect(path.basename(config.globalStyle)).toBe('styles1.css');
    expect(path.isAbsolute(config.globalStyle)).toBe(true);

    const orgPath = config.globalStyle;

    config._isValidated = false;
    validateConfig(config);

    expect(config.globalStyle).toBe(orgPath);
  });

  it('should convert globalStyle string to absolute path array, if a globalStyle property was provided', () => {
    config.globalStyle = 'src/global/styles.css';
    validateConfig(config);
    expect(path.basename(config.globalStyle)).toBe('styles.css');
    expect(path.isAbsolute(config.globalStyle)).toBe(true);
  });

});
