import type * as d from '../../../declarations';
import { createSystem } from '../../../compiler/sys/stencil-sys';
import { loadConfig } from '../load-config';
import path from 'path';

describe('tsconfig sourceMap opts via config', () => {
  const configPath = require.resolve('./fixtures/stencil.config.ts');
  const fixturesPath = path.dirname(configPath);
  const srcPath = path.join(fixturesPath, 'src');
  const indexPath = path.join(srcPath, 'index.ts');
  let sys: d.CompilerSystem;

  beforeEach(() => {
    sys = createSystem();
    sys.writeFileSync(configPath, ``);
    sys.createDirSync(fixturesPath);
    sys.createDirSync(srcPath);
    sys.writeFileSync(indexPath, `console.log('fixture');`);
  });

  it('sets tsconfig sourceMap options to true', async () => {
    const c = await loadConfig({
      configPath: configPath,
      sys,
      config: {
        sourceMap: true,
      },
      initTsConfig: true,
    });
    expect(c.config.tsCompilerOptions.sourceMap).toBe(true);
    expect(c.config.tsCompilerOptions.inlineSources).toBe(true);
  });

  it('sets tsconfig sourceMap options to false', async () => {
    const c = await loadConfig({
      configPath: configPath,
      sys,
      config: {
        sourceMap: false,
      },
      initTsConfig: true,
    });
    expect(c.config.tsCompilerOptions.sourceMap).toBe(false);
    expect(c.config.tsCompilerOptions.inlineSources).toBe(false);
  });

  it('tsconfig sourceMap options default', async () => {
    const c = await loadConfig({
      configPath: configPath,
      sys,
      config: {},
      initTsConfig: true,
    });
    expect(c.config.tsCompilerOptions.sourceMap).toBe(false);
    expect(c.config.tsCompilerOptions.inlineSources).toBe(false);
  });
});
