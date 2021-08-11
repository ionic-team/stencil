import type * as d from '@stencil/core/declarations';
import { mockConfig } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';

describe('validateDocs', () => {
  let userConfig: d.Config;

  beforeEach(() => {
    userConfig = mockConfig();
  });

  it('readme docs dir', () => {
    userConfig.flags.docs = true;
    userConfig.outputTargets = [
      {
        type: 'docs-readme',
        dir: 'my-dir',
      } as d.OutputTargetDocsReadme,
    ];
    const { config } = validateConfig(userConfig);
    const o = config.outputTargets.find((o) => o.type === 'docs-readme') as d.OutputTargetDocsReadme;
    expect(o.dir).toContain('my-dir');
  });

  it('default no docs, not remove docs output target', () => {
    userConfig.outputTargets = [{ type: 'docs-readme' }];
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some((o) => o.type === 'docs-readme')).toBe(true);
  });

  it('default no docs, no output target', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some((o) => o.type === 'docs-readme')).toBe(false);
  });
});
