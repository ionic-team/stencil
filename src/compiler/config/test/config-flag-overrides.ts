import { Config, ConfigFlags } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateBuildConfig } from '../validate-config';

describe('overrideConfigFromArgv', () => {

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


  it('should override dev mode', () => {
    config.devMode = true;
    config.flags = { prod: true };
    validateBuildConfig(config);
    expect(config.devMode).toBe(false);
  });

  it('should override dev mode w/ prod flag', () => {
    config.flags = { prod: true };
    config.devMode = true;
    validateBuildConfig(config);
    expect(config.devMode).toBe(false);
  });

  it('should override prod mode w/ dev flag', () => {
    config.flags = { dev: true };
    config.devMode = false;
    validateBuildConfig(config);
    expect(config.devMode).toBe(true);
  });

  it('should set debug log level', () => {
    config.flags = { debug: true };
    validateBuildConfig(config);
    expect(config.logLevel).toBe('debug');
    expect(config.logger.level).toBe('debug');
  });

  it('should set log level', () => {
    config.flags = { logLevel: 'error' };
    validateBuildConfig(config);
    expect(config.logLevel).toBe('error');
  });

  it('should set cache', () => {
    config.flags = { cache: true };
    config.enableCache = false;
    validateBuildConfig(config);
    expect(config.enableCache).toBe(true);
  });

  it('should set no-cache', () => {
    config.flags = { cache: false };
    config.enableCache = true;
    validateBuildConfig(config);
    expect(config.enableCache).toBe(false);
  });

  it('should disable prerender by default', () => {
    config.flags = {};
    validateBuildConfig(config);
    expect(config.outputTargets[0].prerender).toBe(null);
  });

  it('should enable prerender with argv', () => {
    config.flags = { prerender: true };
    validateBuildConfig(config);
    expect(config.outputTargets[0].prerender).not.toBe(null);
  });

  it('should prerender with argv and in prod mode', () => {
    config.flags = { prerender: true };
    config.devMode = false;
    validateBuildConfig(config);
    expect(config.outputTargets[0].prerender).not.toBe(null);
  });

  it('should not prerender with argv and in dev mode', () => {
    config.flags = { prerender: true };
    config.devMode = true;
    validateBuildConfig(config);
    expect(config.outputTargets[0].prerender).toBe(null);
  });

  it('should enable writeLog with argv', () => {
    config.flags = { log: true };
    validateBuildConfig(config);
    expect(config.writeLog).toBe(true);
  });

  it('should enable docs generate', () => {
    config.flags = { docs: true };
    config.generateDocs = false;
    validateBuildConfig(config);
    expect(config.generateDocs).toBe(true);
  });

  it('should disable docs generate', () => {
    config.flags = { docs: false };
    config.generateDocs = true;
    validateBuildConfig(config);
    expect(config.generateDocs).toBe(false);
  });

});
