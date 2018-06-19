import * as d from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { setProcessEnvironment, validateConfig } from '../validate-config';


describe('copy tasks', () => {

  let config: d.Config;
  const sys = mockStencilSystem();
  const logger = mockLogger();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true
    };
  });

  it('should disable copy task with null', () => {
    config.copy = null;
    validateConfig(config);
    expect(config.copy).toBe(null);
  });

  it('should disable copy task with false', () => {
    (config.copy as any) = false;
    validateConfig(config);
    expect(config.copy).toBe(null);
  });

  it('should remove default copy task', () => {
    config.copy = null;
    validateConfig(config);
    expect(config.copy).toBe(null);
  });

  it('should add copy task and keep defaults', () => {
    config.copy = [
      { src: 'some-dir' }
    ];
    validateConfig(config);
    expect(config.copy.some(c => c.src === 'some-dir')).toBe(true);
    expect(config.copy.some(c => c.src === 'assets')).toBe(true);
    expect(config.copy.some(c => c.src === 'manifest.json')).toBe(true);
  });

  it('should set "assets" copy task default', () => {
    validateConfig(config);
    const assetsTask = config.copy.find(c => c.src === 'assets');
    expect(assetsTask.src).toBe('assets');
    expect(assetsTask.dest).toBeUndefined();
  });

  it('should set "manifest" copy task default', () => {
    validateConfig(config);
    const assetsTask = config.copy.find(c => c.src === 'manifest.json');
    expect(assetsTask.src).toBe('manifest.json');
    expect(assetsTask.dest).toBeUndefined();
  });

});
