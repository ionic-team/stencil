import * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { validateConfig } from '../validate-config';
import path from 'path';

describe('validateTesting', () => {
  let userConfig: d.Config;
  const ROOT = path.resolve('/');
  const sys = mockStencilSystem();
  const logger = mockLogger();

  beforeEach(() => {
    userConfig = {
      sys: sys as any,
      logger: logger,
      rootDir: path.join(ROOT, 'User', 'some', 'path'),
      srcDir: path.join(ROOT, 'User', 'some', 'path', 'src'),
      flags: {},
      namespace: 'Testing',
    };
    userConfig.outputTargets = [
      ({
        type: 'www',
        dir: path.join(ROOT, 'www'),
      } as any) as d.OutputTargetStats,
    ];
  });

  it('set headless false w/ flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = false;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(false);
  });

  it('set headless true w/ flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default headless true', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('force headless with ci flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.headless = false;
    userConfig.flags.ci = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default to no-sandbox browser args with ci flag', () => {
    userConfig.flags.e2e = true;
    userConfig.flags.ci = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserArgs).toEqual(['--font-render-hinting=medium', '--incognito', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);
  });

  it('default browser args', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.browserArgs).toEqual(['--font-render-hinting=medium', '--incognito']);
  });

  it('set default testPathIgnorePatterns', () => {
    userConfig.flags.e2e = true;
    const { config } = validateConfig(userConfig);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'www'),
    ]);
  });

  it('set default testPathIgnorePatterns with custom outputTargets', () => {
    userConfig.flags.e2e = true;
    userConfig.outputTargets = [
      { type: 'dist', dir: 'dist-folder' },
      { type: 'www', dir: 'www-folder' },
      { type: 'docs', dir: 'docs' },
    ];
    const { config } = validateConfig(userConfig);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'User', 'some', 'path', 'www-folder'),
      path.join(ROOT, 'User', 'some', 'path', 'dist-folder'),
    ]);
  });
});
