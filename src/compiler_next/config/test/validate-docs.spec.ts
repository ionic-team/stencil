import * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';


describe('validateDocs', () => {

  let config: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      flags: {},
      outputTargets: [
        { type: 'www' }
      ],
      namespace: 'Testing'
    };
  });

  it('readme docs dir', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        dir: 'my-dir'
      } as d.OutputTargetDocsReadme
    );
    validateConfig(config, [], false);
    const o = config.outputTargets.find(o => o.type === 'docs-readme') as d.OutputTargetDocsReadme;
    expect(o.dir).toContain('my-dir');
  });

  it('default no docs, not remove docs output target', () => {
    config.outputTargets.push({ type: 'docs' });
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'docs-readme')).toBe(true);
  });

  it('default no docs, no output target', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'docs-readme')).toBe(false);
  });

});
