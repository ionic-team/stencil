import { createSystem } from '../../../compiler_next/sys/stencil-sys';
import { loadConfig } from '../load-config';
import { normalizePath } from '../../../utils';


describe('load config', () => {
  const configPath = require.resolve('./fixtures/stencil.config.ts');
  const sys = createSystem();
  sys.writeFileSync(configPath, ``);

  it('merge users config', async () => {
    const c = await loadConfig({
      sys,
      config: {
        hashedFileNameLength: 9,
      }
    });
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config).toBeDefined();
    expect(c.config.hashedFileNameLength).toBe(9);
  });

  it('read fixture configPath', async () => {
    const c = await loadConfig({
      configPath,
      sys,
    });
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config.configPath).toBe(normalizePath(configPath));
    expect(c.config).toBeDefined();
    expect(c.config.hashedFileNameLength).toBe(13);
  });

  it('invalid given configPath', async () => {
    const c = await loadConfig({
      configPath: 'no-good.fu',
      sys: createSystem(),
    });
    expect(c.diagnostics).toHaveLength(1);
    expect(c.diagnostics[0].header).toBe('Invalid config path');
    expect(c.config).toBe(null);
  });

  it('empty init, no error for trying default config path', async () => {
    const c = await loadConfig({});
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config).toBeDefined();
    expect(c.config.sys_next).toBeDefined();
    expect(c.config.logger).toBeDefined();
    expect(c.config.configPath).toBe(null);
  });

  it('no init', async () => {
    const c = await loadConfig();
    expect(c.diagnostics).toHaveLength(0);
    expect(c.config).toBeDefined();
    expect(c.config.sys_next).toBeDefined();
    expect(c.config.logger).toBeDefined();
    expect(c.config.configPath).toBe(null);
    expect(c.config.hashedFileNameLength).toBe(8);
  });

});
