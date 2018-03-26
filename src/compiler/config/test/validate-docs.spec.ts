import * as d from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateDocs', () => {

  let config: d.Config;
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


  it('docs default readme', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs', dir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o: d.OutputTargetDocs = config.outputTargets.find(o => o.type === 'docs');
    expect(o).toBeDefined();
    expect(o.dir).toContain('my-dir');
  });

  it('docs, keep docs output target', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        dir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o: d.OutputTargetDocs = config.outputTargets.find(o => o.type === 'docs');
    expect(o).toBeDefined();
    expect(o.dir).toContain('my-dir');
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
