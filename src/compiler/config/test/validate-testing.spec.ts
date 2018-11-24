import * as d from '../../../declarations';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { validateConfig } from '../validate-config';
import * as path from 'path';


describe('validateTesting', () => {

  let config: d.Config;
  const ROOT = path.resolve('/');

  beforeEach(() => {
    config = {
      sys: mockStencilSystem(),
      logger: mockLogger(),
      rootDir: path.join(ROOT, 'User', 'some', 'path'),
      srcDir: path.join(ROOT, 'User', 'some', 'path', 'src'),
      flags: {},
      outputTargets: [{
        type: 'www',
        dir: path.join(ROOT, 'www')
      } as any as d.OutputTargetStats]
    };
  });


  it('set headless false w/ flag', () => {
    config.flags.e2e = true;
    config.flags.headless = false;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(false);
  });

  it('set headless true w/ flag', () => {
    config.flags.e2e = true;
    config.flags.headless = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default headless true', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('force headless with ci flag', () => {
    config.flags.e2e = true;
    config.flags.headless = false;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserHeadless).toBe(true);
  });

  it('default to no-sandbox browser args with ci flag', () => {
    config.flags.e2e = true;
    config.flags.ci = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual([
      '--disable-gpu',
      '--disable-canvas-aa',
      '--disable-composited-antialiasing',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]);
  });

  it('default browser args', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.browserArgs).toEqual([
      '--disable-gpu',
      '--disable-canvas-aa',
      '--disable-composited-antialiasing'
    ]);
  });

  it('set default testPathIgnorePatterns', () => {
    config.flags.e2e = true;
    validateConfig(config);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'www')
    ]);
  });

  it('set default testPathIgnorePatterns with custom outputTargets', () => {
    config.flags.e2e = true;
    config.outputTargets = [
      { type: 'dist', dir: 'dist-folder' },
      { type: 'www', dir: 'www-folder' },
      { type: 'docs', dir: 'docs' },
    ];
    validateConfig(config);
    expect(config.testing.testPathIgnorePatterns).toEqual([
      path.join(ROOT, 'User', 'some', 'path', '.vscode'),
      path.join(ROOT, 'User', 'some', 'path', '.stencil'),
      path.join(ROOT, 'User', 'some', 'path', 'node_modules'),
      path.join(ROOT, 'User', 'some', 'path', 'dist-folder'),
      path.join(ROOT, 'User', 'some', 'path', 'www-folder'),
    ]);
  });
});
