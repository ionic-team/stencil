import type * as d from '../../../declarations';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import { loadConfig } from '../load-config';
import path from 'path';
import { mockLoadConfigInit } from '@stencil/core/testing';

describe('stencil config - sourceMap option', () => {
  const configPath = require.resolve('./fixtures/stencil.config.ts');
  const fixturesPath = path.dirname(configPath);
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
    sys = createSystem();
    sys.writeFileSync(configPath, ``);
    sys.createDirSync(fixturesPath);
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

  it('sets the sourceMap options to false in tsconfig by default', async () => {
    const testConfig = getLoadConfigForTests();

    const loadConfigResults = await loadConfig(testConfig);

    const { sourceMap, inlineSources } = loadConfigResults.config.tsCompilerOptions;
    expect(sourceMap).toBe(false);
    expect(inlineSources).toBe(false);
  });
});
