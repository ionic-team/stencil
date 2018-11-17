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
      flags: {},
      outputTargets: [
        { type: 'www' }
      ]
    };
  });


  it('readme docs dir', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        dir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(o.dir).toContain('my-dir');
  });

  it('_deprecated: docs readmeDir', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        readmeDir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(o.dir).toContain('my-dir');
  });

  it('readme docs, keep docs output target', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        dir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(o.dir).toContain('my-dir');
  });

  it('_deprecated: docs, keep docs output target', () => {
    config.flags.docs = true;
    config.outputTargets.push(
      {
        type: 'docs',
        readmeDir: 'my-dir'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(o.dir).toContain('my-dir');
  });

  it('docs-json w/ existing docs config', () => {
    config.flags.docsJson = 'some/path/docs.json';
    config.outputTargets.push(
      {
        type: 'docs-json'
      } as d.OutputTargetDocsJson
    );
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs-json') as d.OutputTargetDocsJson;
    expect(o.file).toContain('docs.json');
  });

  it('_deprecated: docs-json w/ existing docs config', () => {
    config.flags.docsJson = 'some/path/docs.json';
    config.outputTargets.push(
      {
        type: 'docs'
      } as d.OutputTargetDocs
    );
    validateConfig(config);
    const depricated = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(depricated).toBeUndefined();
    const o = config.outputTargets.find(o => o.type === 'docs-json') as d.OutputTargetDocsJson;
    expect(o.file).toContain('docs.json');
  });

  it('docs-json flag', () => {
    config.flags.docsJson = 'some/path/docs.json';
    validateConfig(config);
    const o = config.outputTargets.find(o => o.type === 'docs-json') as d.OutputTargetDocsJson;
    expect(o.file).toContain('docs.json');
  });

  it('_deprecated: docs-json flag', () => {
    config.flags.docsJson = 'some/path/docs.json';
    validateConfig(config);
    const depricated = config.outputTargets.find(o => o.type === 'docs') as d.OutputTargetDocs;
    expect(depricated).toBeUndefined();
    const o = config.outputTargets.find(o => o.type === 'docs-json') as d.OutputTargetDocsJson;
    expect(o.file).toContain('docs.json');
  });

  it('docs flag, and docs output target', () => {
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
