import type * as d from '../../../declarations';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import { loadConfig } from '../load-config';
import { normalizePath } from '../../../utils';
import path from 'path';

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

  it('merge users config', async () => {
    const c = await loadConfig({
      configPath: configPath2,
      sys,
      config: {
        hashedFileNameLength: 9,
      },
      initTsConfig: true,
    });
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config).toBeDefined();
    expect(c.config.hashedFileNameLength).toBe(9);
  });

  it('read fixture configPath', async () => {
    const c = await loadConfig({
      configPath,
      sys,
      initTsConfig: true,
    });
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config.configPath).toBe(normalizePath(configPath));
    expect(c.config).toBeDefined();
    expect(c.config.hashedFileNameLength).toBe(13);
  });

  it('empty init, no error cuz created tsconfig, warn no files', async () => {
    const c = await loadConfig({ initTsConfig: true });
    expect(c.diagnostics.filter((d) => d.level === 'error')).toHaveLength(0);
    expect(c.diagnostics.filter((d) => d.level === 'warn')).toHaveLength(1);
    expect(c.config).toBeDefined();
    expect(c.config.sys).toBeDefined();
    expect(c.config.logger).toBeDefined();
    expect(c.config.configPath).toBe(null);
  });

  it('empty init, error cuz didnt auto create tsconfig', async () => {
    const c = await loadConfig({});
    expect(c.diagnostics).toHaveLength(1);
  });

  it('no init', async () => {
    const c = await loadConfig();
    expect(c.diagnostics).toHaveLength(1);
  });
});
