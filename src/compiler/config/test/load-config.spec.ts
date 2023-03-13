import path from 'path';

import { ConfigFlags } from '../../../cli/config-flags';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import type * as d from '../../../declarations';
import { normalizePath } from '../../../utils';
import { loadConfig } from '../load-config';

describe('load config', () => {
  const configPath = require.resolve('./fixtures/stencil.config.ts');
  const configPath2 = require.resolve('./fixtures/stencil.config2.ts');
  const fixturesPath = path.dirname(configPath);
  const srcPath = path.join(fixturesPath, 'src');
  const indexPath = path.join(srcPath, 'index.ts');
  let sys: d.CompilerSystem;

  beforeEach(() => {
    sys = createSystem();
    sys.writeFileSync(configPath, ``);
    sys.writeFileSync(configPath2, ``);
    sys.createDirSync(fixturesPath);
    sys.createDirSync(srcPath);
    sys.writeFileSync(indexPath, `console.log('fixture');`);
  });

  it("merges a user's configuration with a stencil.config file on disk", async () => {
    const loadedConfig = await loadConfig({
      configPath: configPath2,
      sys,
      config: {
        hashedFileNameLength: 9,
      },
      initTsConfig: true,
    });

    expect(loadedConfig.diagnostics).toHaveLength(0);

    const actualConfig = loadedConfig.config;
    // this field is defined on the `init` argument, and should override the value found in the config on disk
    expect(actualConfig).toBeDefined();
    expect(actualConfig.hashedFileNameLength).toEqual(9);
    // these fields are defined in the config file on disk, and should be present
    expect<ConfigFlags>(actualConfig.flags).toEqual({ dev: true });
    expect(actualConfig.extras).toBeDefined();
    expect(actualConfig.extras!.enableImportInjection).toBe(true);
  });

  it('uses the provided config path when no initial config provided', async () => {
    const loadedConfig = await loadConfig({
      configPath,
      sys,
      initTsConfig: true,
    });

    expect(loadedConfig.diagnostics).toHaveLength(0);

    const actualConfig = loadedConfig.config;
    expect(actualConfig).toBeDefined();
    // set the config path based on the one provided in the init object
    expect(actualConfig.configPath).toBe(normalizePath(configPath));
    // this field is defined in the config file on disk, and should be present
    expect(actualConfig.hashedFileNameLength).toBe(13);
    // this field should default to an empty object literal, since it wasn't present in the config file
    expect<ConfigFlags>(actualConfig.flags).toEqual({});
  });

  describe('empty initialization argument', () => {
    it('provides sensible default values with no config', async () => {
      const loadedConfig = await loadConfig({ initTsConfig: true });

      const actualConfig = loadedConfig.config;
      expect(actualConfig).toBeDefined();
      expect(actualConfig.sys).toBeDefined();
      expect(actualConfig.logger).toBeDefined();
      expect(actualConfig.configPath).toBe(null);
    });

    it('warns that a tsconfig file could not be found when "initTsConfig" set', async () => {
      const loadedConfig = await loadConfig({ initTsConfig: true });

      expect(loadedConfig.diagnostics).toHaveLength(1);
      expect<d.Diagnostic>(loadedConfig.diagnostics[0]).toEqual({
        absFilePath: '/tsconfig.json',
        code: '18003',
        columnNumber: undefined,
        header: 'TypeScript',
        language: 'typescript',
        level: 'warn',
        lineNumber: undefined,
        lines: [],
        messageText:
          "No inputs were found in config file '/tsconfig.json'. Specified 'include' paths were '[\"src\"]' and 'exclude' paths were '[]'.",
        relFilePath: undefined,
        type: 'typescript',
      });
    });

    it('errors that a tsconfig file could not be created when "initTsConfig" isn\'t present', async () => {
      const loadedConfig = await loadConfig({});
      expect(loadedConfig.diagnostics).toHaveLength(1);
      expect<d.Diagnostic>(loadedConfig.diagnostics[0]).toEqual({
        absFilePath: null,
        header: 'Missing tsconfig.json',
        level: 'error',
        lines: [],
        messageText:
          'Unable to load TypeScript config file. Please create a "tsconfig.json" file within the "/" directory.',
        relFilePath: null,
        type: 'build',
      });
    });
  });

  describe('no initialization argument', () => {
    it('errors that a tsconfig file could not be created', async () => {
      const loadConfigResults = await loadConfig();
      expect(loadConfigResults.diagnostics).toHaveLength(1);
      expect<d.Diagnostic>(loadConfigResults.diagnostics[0]).toEqual({
        absFilePath: null,
        header: 'Missing tsconfig.json',
        level: 'error',
        lines: [],
        messageText:
          'Unable to load TypeScript config file. Please create a "tsconfig.json" file within the "/" directory.',
        relFilePath: null,
        type: 'build',
      });
    });
  });
});
