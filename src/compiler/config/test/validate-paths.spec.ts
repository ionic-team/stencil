import { ValidatedConfig } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateBuildConfig } from '../validate-config';
import * as path from 'path';


describe('validatePaths', () => {

  let config: ValidatedConfig;
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
    validateBuildConfig(config);
    expect(path.basename(config.wwwIndexHtml)).toBe('index.html');
    expect(path.isAbsolute(config.wwwIndexHtml)).toBe(true);
  });

  it('should convert a custom wwwIndexHtml to absolute path', () => {
    config.wwwIndexHtml = 'assets/custom-index.html';
    validateBuildConfig(config);
    expect(path.basename(config.wwwIndexHtml)).toBe('custom-index.html');
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

  it('should set default emptyDist to true', () => {
    validateBuildConfig(config);
    expect(config.emptyDist).toBe(true);
  });

  it('should set emptyDist to false', () => {
    config.emptyDist = false;
    validateBuildConfig(config);
    expect(config.emptyDist).toBe(false);
  });

  it('should set default emptyWWW to true', () => {
    validateBuildConfig(config);
    expect(config.emptyWWW).toBe(true);
  });

  it('should set emptyWWW to false', () => {
    config.emptyWWW = false;
    validateBuildConfig(config);
    expect(config.emptyWWW).toBe(false);
  });

  it('should set default collection dir and convert to absolute path', () => {
    validateBuildConfig(config);
    expect(path.basename(config.collectionDir)).toBe('collection');
    expect(path.isAbsolute(config.collectionDir)).toBe(true);
  });

  it('should set default tsconfig and convert to absolute path', () => {
    validateBuildConfig(config);
    expect(path.basename(config.tsconfig)).toBe('tsconfig.json');
    expect(path.isAbsolute(config.tsconfig)).toBe(true);
  });

  it('should set default types dir and convert to absolute path', () => {
    validateBuildConfig(config);
    expect(path.basename(config.typesDir)).toBe('types');
    expect(path.isAbsolute(config.typesDir)).toBe(true);
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

  it('should set src dir from incorrect config case', () => {
    (config as any).SrcDIR = () => 'myapp';
    validateBuildConfig(config);
    expect(path.basename(config.srcDir)).toBe('myapp');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set src dir from function', () => {
    (config as any).srcDir = () => 'myapp';
    validateBuildConfig(config);
    expect(path.basename(config.srcDir)).toBe('myapp');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set default src dir and convert to absolute path', () => {
    validateBuildConfig(config);
    expect(path.basename(config.srcDir)).toBe('src');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should set src dir and convert to absolute path', () => {
    config.srcDir = 'app';
    validateBuildConfig(config);
    expect(path.basename(config.srcDir)).toBe('app');
    expect(path.isAbsolute(config.srcDir)).toBe(true);
  });

  it('should convert globalScript to absolute path, if a globalScript property was provided', () => {
    config.globalScript = 'src/global/index.ts';
    validateBuildConfig(config);
    expect(path.basename(config.globalScript)).toBe('index.ts');
    expect(path.isAbsolute(config.globalScript)).toBe(true);
  });

  it('should handle absolute paths on re-validate', () => {
    config.globalStyle = 'src/global/styles1.css' as any;
    validateBuildConfig(config);
    expect(path.basename(config.globalStyle[0])).toBe('styles1.css');
    expect(path.isAbsolute(config.globalStyle[0])).toBe(true);

    const orgPath = config.globalStyle[0];

    config._isValidated = false;
    validateBuildConfig(config);

    expect(config.globalStyle[0]).toBe(orgPath);
  });

  it('should convert globalStyle string to absolute path array, if a globalStyle property was provided', () => {
    config.globalStyle = 'src/global/styles.css' as any;
    validateBuildConfig(config);
    expect(path.basename(config.globalStyle[0])).toBe('styles.css');
    expect(path.isAbsolute(config.globalStyle[0])).toBe(true);
  });

});
