import { Config } from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateDocs', () => {

  let config: Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true,
      flags: {},
      outputTargets: [
        { type: 'www' }
      ]
    };
  });


  it('docs default json dist', () => {
    config.flags.docs = true;
    config.outputTargets.push({ type: 'docs', format: 'json' });
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs');
    expect(o).toBeDefined();
    expect(o.path).toContain('dist');
    expect(o.format).toBe('json');
  });

  it('docs default readme', () => {
    config.flags.docs = true;
    config.outputTargets.push({ type: 'docs', path: 'my-dir' });
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs');
    expect(o).toBeDefined();
    expect(o.path).toContain('my-dir');
    expect(o.format).toBe('readme');
  });

  it('docs, keep docs output target', () => {
    config.flags.docs = true;
    config.outputTargets.push({ type: 'docs', path: 'my-dir' });
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs');
    expect(o).toBeDefined();
    expect(o.path).toContain('my-dir');
  });

  it('docs, and docs output target', () => {
    config.flags.docs = true;
    validateConfig(config);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(true);
  });

  it('default no docs, remove docs output target', () => {
    config.outputTargets.push({ type: 'docs' });
    validateConfig(config);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

  it('default no docs, no output target', () => {
    validateConfig(config);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

});
