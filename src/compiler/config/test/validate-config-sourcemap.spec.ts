import { mockLoadConfigInit } from '@stencil/core/testing';
import { getMockFSPatch } from '@stencil/core/testing';
import { createNodeSys } from '@sys-api-node';
import mock from 'mock-fs';
import path from 'path';

import type * as d from '../../../declarations';
import { loadConfig } from '../load-config';

describe('stencil config - sourceMap option', () => {
  const fixturesDir = 'fixtures';
  const configPath = path.join(fixturesDir, 'stencil.config.ts');
  let sys: d.CompilerSystem;

  /**
   * Test helper for generating default `d.LoadConfigInit` objects.
   *
   * This function assumes the fields in the enclosing scope have been initialized.
   * @param overrides the properties on the default `d.LoadConfigInit` entity to manually override
   * @returns the default configuration initialization object, with any overrides applied
   */
  const getLoadConfigForTests = (overrides?: Partial<d.LoadConfigInit>): d.LoadConfigInit => {
    const defaults: d.LoadConfigInit = {
      configPath: configPath,
      sys,
      config: {},
      initTsConfig: true,
    };

    return mockLoadConfigInit({ ...defaults, ...overrides });
  };

  beforeEach(() => {
    sys = createNodeSys();

    mock({
      [configPath]: mock.load(path.resolve(__dirname, configPath)),
      ...getMockFSPatch(mock),
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('sets sourceMap options to true in tsconfig', async () => {
    const testConfig = getLoadConfigForTests({ config: { sourceMap: true } });

    const loadConfigResults = await loadConfig(testConfig);

    const { sourceMap, inlineSources } = loadConfigResults.config.tsCompilerOptions;
    expect(sourceMap).toBe(true);
    expect(inlineSources).toBe(true);
  });

  it('sets sourceMap options to false in tsconfig', async () => {
    const testConfig = getLoadConfigForTests({ config: { sourceMap: false } });

    const loadConfigResults = await loadConfig(testConfig);

    const { sourceMap, inlineSources } = loadConfigResults.config.tsCompilerOptions;
    expect(sourceMap).toBe(false);
    expect(inlineSources).toBe(false);
  });

  it('sets the sourceMap options to true in tsconfig by default', async () => {
    const testConfig = getLoadConfigForTests();

    const loadConfigResults = await loadConfig(testConfig);

    const { sourceMap, inlineSources } = loadConfigResults.config.tsCompilerOptions;
    expect(sourceMap).toBe(true);
    expect(inlineSources).toBe(true);
  });
});
